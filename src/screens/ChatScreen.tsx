import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useTeam } from "../contexts/TeamContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabase";
import { Chat, Message } from "../types";
import { COLORS } from "../config/sports";
import { SafeAreaView } from "react-native-safe-area-context";

export const ChatScreen = () => {
  const { currentTeam } = useTeam();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentTeam) {
      loadChats();
    }
  }, [currentTeam]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
      subscribeToMessages();
    }
  }, [selectedChat]);

  const loadChats = async () => {
    if (!currentTeam) return;

    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("team_id", currentTeam.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const chatList = data || [];
      setChats(chatList);

      // Create default chat if none exists
      if (chatList.length === 0) {
        await createDefaultChat();
      } else if (!selectedChat) {
        setSelectedChat(chatList[0]);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

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
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;

    try {
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
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedChat) return;

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
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase.from("messages").insert({
        chat_id: selectedChat.id,
        user_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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

  if (!currentTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Selecione um time para acessar o chat</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chatsList}>
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={[styles.chatTab, selectedChat?.id === chat.id && styles.chatTabActive]}
                onPress={() => setSelectedChat(chat)}
              >
                <Text style={styles.chatIcon}>{getChatIcon(chat.type)}</Text>
                <Text style={[styles.chatName, selectedChat?.id === chat.id && styles.chatNameActive]}>{chat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => {
            const isOwnMessage = message.user_id === user?.id;

            return (
              <View key={message.id} style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
                {!isOwnMessage && <Text style={styles.messageSender}>{message.user?.name || "Usuário"}</Text>}
                <View style={[styles.messageBubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
                  <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
                    {message.content}
                  </Text>
                </View>
                <Text style={styles.messageTime}>
                  {new Date(message.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
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
    paddingBottom: -100
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    
  },
  header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chatsList: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  chatTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
  },
  chatTabActive: {
    backgroundColor: COLORS.primary,
  },
  chatIcon: {
    fontSize: 16,
    marginRight: 6,
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
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
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
    marginLeft: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: "100%",
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
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
    padding: 12,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
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
});
