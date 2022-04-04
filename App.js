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
			onPanResponderGrant: () => {
				console.log("Touch Started");
				POSITION.setOffset({
					x: POSITION.x._value,
					y: POSITION.y._value,
				});
			},
			//dx, dy는 손가락이 이동한 거리이기 때문에 항상 0에서부터 시작한다.
			// 이전 위치가 어디인지 기억하지 못한다는 것이 문제
			onPanResponderMove: (_, { dx, dy }) => {
				console.log("Finger Moving");
				POSITION.setValue({
					x: dx,
					y: dy,
				});
			},
			onPanResponderRelease: () => {
				console.log("Touch Finished");
				POSITION.flattenOffset();
			},
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
