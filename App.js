import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const Box = styled.View`
	background-color: tomato;
	width: 200px;
	height: 200px;
`;
const AnimateBox = Animated.createAnimatedComponent(Box);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
	const POSITION = useRef(
		new Animated.ValueXY({
			x: 0,
			y: 0,
		})
	).current;
	const borderRadius = POSITION.y.interpolate({
		inputRange: [-300, 300],
		outputRange: [100, 0],
	});
	const backgroundColor = POSITION.y.interpolate({
		inputRange: [-300, 300],
		outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
	});
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, { dx, dy }) => {
				POSITION.setValue({
					x: dx,
					y: dy,
				});
			},
			onPanResponderRelease: () => {
				Animated.spring(POSITION, {
					toValue: {
						x: 0,
						y: 0,
					},
					useNativeDriver: false,
				}).start();
			}, // 손가락을 떼었을 때 작동
		})
	).current;
	return (
		<Container>
			<AnimateBox
				{...panResponder.panHandlers}
				style={{
					borderRadius,
					backgroundColor,
					transform: POSITION.getTranslateTransform(),
				}}
			/>
		</Container>
	);
}
