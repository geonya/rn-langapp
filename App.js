import React from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const Box = styled.TouchableOpacity`
	background-color: tomato;
	width: 200px;
	height: 200px;
`;
const AnimateBox = Animated.createAnimatedComponent(Box);

export default function App() {
	const Y = new Animated.Value(0);
	const moveUp = () => {};
	return (
		<Container>
			<AnimateBox onPress={moveUp} style={{ transform: [{ translateY: Y }] }} />
		</Container>
	);
}
