import React, { useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { PlayerMarker } from "./PlayerMarker";
import { Player } from "../types";

interface DraggablePlayerProps {
  player: Player;
  onDrag: (playerId: string, x: number, y: number) => void;
  courtWidth: number;
  courtHeight: number;
}

export const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player, onDrag, courtWidth, courtHeight }) => {
  const [position, setPosition] = useState({ x: player.x, y: player.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(0, Math.min(position.x + gestureState.dx, courtWidth - 40));
      const newY = Math.max(0, Math.min(position.y + gestureState.dy, courtHeight - 40));

      setPosition({ x: newX, y: newY });
    },
    onPanResponderRelease: () => {
      onDrag(player.id, position.x, position.y);
    },
  });

  return (
    <View
      style={[
        styles.playerContainer,
        {
          left: position.x,
          top: position.y,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <PlayerMarker number={player.jersey_number} position={player.position} />
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    zIndex: 10,
  },
});
