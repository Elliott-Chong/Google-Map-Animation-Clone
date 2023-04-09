import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import {
  FlatList,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type BottomSheetProps = {};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
};

const { height } = Dimensions.get("screen");

const BottomSheet = React.forwardRef<BottomSheetProps, BottomSheetRefProps>(
  ({}, ref) => {
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    React.useEffect(() => {
      translateY.value = withSpring(-height / 3, {
        damping: 50,
      });
    }, []);
    const scrollTo = useCallback((destination: number) => {
      "worklet";
      translateY.value = withSpring(destination, { damping: 50 });
    }, []);
    React.useImperativeHandle(
      ref,
      () => ({
        scrollTo,
      }),
      [scrollTo]
    );

    const gesture = Gesture.Pan()
      .onBegin(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(-height + 70, translateY.value);
      })
      .onEnd(() => {
        if (translateY.value > -150) {
          scrollTo(-50);
        } else if (translateY.value > -height / 2) {
          scrollTo(-height / 3);
        } else if (translateY.value > -height + 70) {
          scrollTo(-height + 70);
        }
      });
    const animatedStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [-height + 100, -height + 50],
        [25, 5],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateY: translateY.value }],
        borderRadius,
      };
    });
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, animatedStyle]}>
          <View style={styles.line} />
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            renderItem={({ item }) => {
              return <Text>{item}</Text>;
            }}
          />
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: height,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: height,
    borderRadius: 20,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "gray",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheet;
