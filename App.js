import React, { useRef, useState } from "react";
import { Animated, Pressable } from "react-native";
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

export default function App() {
	const [up, setUp] = useState(false);
	const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 300 })).current;
	const toggleUp = () => setUp((prev) => !prev);
	const moveUp = () => {
		Animated.timing(POSITION, {
			toValue: up ? 300 : -300,
			useNativeDriver: false,
			duration: 2000,
		}).start(toggleUp);
	};
	const rotateY = POSITION.y.interpolate({
		inputRange: [-300, 300],
		outputRange: ["-360deg", "360deg"],
	});
	const borderRadius = POSITION.y.interpolate({
		inputRange: [-300, 300],
		outputRange: [100, 0],
	});
	const backgroundColor = POSITION.y.interpolate({
		inputRange: [-300, 300],
		outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
	});
	return (
		<Container>
			<Pressable onPress={moveUp}>
				<AnimateBox
					style={{
						borderRadius,
						backgroundColor,
						transform: [{ rotateY }, { translateY: POSITION.y }],
					}}
				/>
			</Pressable>
		</Container>
	);
}
