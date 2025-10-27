import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTeam } from "../contexts/TeamContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabase";
import { Chat, Message } from "../types";
import { COLORS } from "../config/sports";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl } from "react-native";
import * as Font from "expo-font";

const NOME_FONTE = "BeVietnamSemibold";

export const ChatScreen = () => {
  const { currentTeam } = useTeam();
  const { user } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedChat) {
        await loadMessages();
      } else {
        await loadChats();
      }
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadChats = useCallback(async () => {
    if (!currentTeam) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("team_id", currentTeam.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const chatList = data || [];
      setChats(chatList);

      if (chatList.length === 0) {
        await createDefaultChat();
      } else if (!selectedChat) {
        setSelectedChat(chatList[0]);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      Alert.alert("Erro", "Não foi possível carregar os chats");
    } finally {
      setLoading(false);
    }
  }, [currentTeam, selectedChat]);

  const createDefaultChat = async () => {
    if (!currentTeam) return;

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert({
          team_id: currentTeam.id,
          name: "Geral",
          type: "general",
        })
        .select()
        .single();

      if (error) throw error;
      setChats([data]);
      setSelectedChat(data);
    } catch (error) {
      console.error("Error creating default chat:", error);
      Alert.alert("Erro", "Não foi possível criar o chat padrão");
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user:users(name, avatar_url)
        `
        )
        .eq("chat_id", selectedChat.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const messagesWithUser = (data || []).map((message) => ({
        ...message,
        user: message.user || { name: "Usuário", avatar_url: null },
      }));

      setMessages(messagesWithUser);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error loading messages:", error);
      Alert.alert("Erro", "Não foi possível carregar as mensagens");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedChat) return;

    try {
      const subscription = supabase
        .channel(`chat:${selectedChat.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${selectedChat.id}`,
          },
          async (payload) => {
            const newMessage = payload.new as Message;

            const { data: userData } = await supabase.from("users").select("name, avatar_url").eq("id", newMessage.user_id).single();

            const messageWithUser = {
              ...newMessage,
              user: userData || { name: "Usuário", avatar_url: null },
            };

            setMessages((current) => {
              const existingTempIndex = current.findIndex(
                (msg) => msg.id.startsWith("temp-") && msg.content === newMessage.content && msg.user_id === newMessage.user_id
              );

              if (existingTempIndex !== -1) {
                const updatedMessages = [...current];
                updatedMessages[existingTempIndex] = messageWithUser;
                return updatedMessages;
              } else {
                const messageExists = current.some((msg) => msg.id === newMessage.id);
                if (!messageExists) {
                  return [...current, messageWithUser];
                }
                return current;
              }
            });

            if (newMessage.user_id !== user?.id) {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          }
        )
        .subscribe();

      return subscription;
    } catch (error) {
      console.error("Error subscribing to messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    let optimisticMessage: Message | null = null;

    try {
      setSending(true);

      optimisticMessage = {
        id: `temp-${Date.now()}`,
        chat_id: selectedChat.id,
        user_id: user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
        },
      };

      setMessages((current) => [...current, optimisticMessage as Message]);
      setNewMessage("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);

      const { error } = await supabase.from("messages").insert({
        chat_id: selectedChat.id,
        user_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);

      if (optimisticMessage?.id) {
        setMessages((current) => current.filter((msg) => msg.id !== optimisticMessage!.id));
      }

      Alert.alert("Erro", "Não foi possível enviar a mensagem");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
      const subscription = subscribeToMessages();

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    Font.loadAsync({ [NOME_FONTE]: require("../../assets/BeVietnamPro-SemiBold.ttf") }).then(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    if (currentTeam) {
      loadChats();
    }
  }, [currentTeam, loadChats]);

  if (!fontLoaded) return null;

  const getChatIcon = (type: Chat["type"]) => {
    switch (type) {
      case "general":
        return "💬";
      case "strategy":
        return "🎯";
      case "training":
        return "🏋️";
      default:
        return "💬";
    }
  };

  const getChatDisplayName = (chat: Chat) => {
    const baseName = chat.name;
    const icon = getChatIcon(chat.type);
    return `${icon} ${baseName}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.user_id === user?.id;

    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        {!isOwnMessage && <Text style={[styles.messageSender, styles.BeVietnamPro]}>{item.user?.name || "Usuário"}</Text>}
        <View style={[styles.messageBubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText, styles.BeVietnamPro]}>
            {item.content}
          </Text>
        </View>
        <Text style={[styles.messageTime, styles.BeVietnamPro]}>
          {new Date(item.created_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  if (!currentTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, styles.BeVietnamPro]}>Selecione um time para acessar o chat</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header com lista de chats */}
        <View style={styles.header}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chatsList}
            contentContainerStyle={styles.chatsListContent}
          >
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={[styles.chatTab, selectedChat?.id === chat.id && styles.chatTabActive]}
                onPress={() => setSelectedChat(chat)}
              >
                <Text style={[styles.chatName, selectedChat?.id === chat.id && styles.chatNameActive, styles.BeVietnamPro]}>
                  {getChatDisplayName(chat)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Área de mensagens */}
        {loading && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={[styles.loadingText, styles.BeVietnamPro]}>Carregando mensagens...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />
            }
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            onLayout={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }, 200);
            }}
            ListEmptyComponent={
              <View style={styles.emptyMessages}>
                <Text style={[styles.emptyMessagesText, styles.BeVietnamPro]}>Nenhuma mensagem ainda</Text>
                <Text style={[styles.emptyMessagesSubtext, styles.BeVietnamPro]}>
                  {selectedChat?.type === "general" && "Inicie uma conversa com o time!"}
                  {selectedChat?.type === "strategy" && "Discuta estratégias e táticas aqui!"}
                  {selectedChat?.type === "training" && "Compartilhe dicas de treino!"}
                </Text>
              </View>
            }
          />
        )}

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.BeVietnamPro]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={`Enviar mensagem em ${selectedChat?.name || "chat"}...`}
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={1000}
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.sendButtonText, styles.BeVietnamPro]}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 60,
  },
  chatsList: {
    flex: 1,
  },
  chatsListContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  chatTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chatTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chatName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  chatNameActive: {
    color: "#FFFFFF",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    fontFamily: NOME_FONTE,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "85%",
  },
  ownMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageSender: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginLeft: 12,
    fontWeight: "500",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: "100%",
    fontFamily: NOME_FONTE,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: COLORS.text,
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "flex-end",
    minHeight: 80,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
    fontFamily: NOME_FONTE,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyMessagesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: "600",
  },
  emptyMessagesSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.7,
    textAlign: "center",
  },
  BeVietnamPro: {
    fontFamily: NOME_FONTE,
  },
});
