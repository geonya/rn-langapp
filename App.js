import React from "react";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
// touchableOpacity 는 animation이 제대로 작동하지 않음. 그래서 View 에 animation 을 적용하고 TouchableOpacity로 감싸면 됨
const Box = styled.View`
	background-color: tomato;
	width: 200px;
	height: 200px;
`;
const AnimateBox = Animated.createAnimatedComponent(Box);

export default function App() {
	const Y = new Animated.Value(0);
	// const moveUp = () => {
	// 	Animated.timing(Y, {
	// 		toValue: -200,
	// 		useNativeDriver: true, // animation이 native 단에서 실행
	// 	}).start();
	// };
	const moveUp = () => {
		Animated.spring(Y, {
			toValue: -200,
			// bounciness: 15,
			tension: 100,
			friction: 1,
			useNativeDriver: true,
		}).start();
	};
	Y.addListener(() => console.log(Y));
	return (
		<Container>
			<TouchableOpacity onPress={moveUp}>
				<AnimateBox style={{ transform: [{ translateY: Y }] }} />
			</TouchableOpacity>
		</Container>
	);
}
