import React, { useRef, useState } from "react";
import { Animated, Easing, Pressable } from "react-native";
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
	const [up, setUp] = useState(false);
	// useRef 는 다시 렌더링이 일어나더라도 value를 유지하게 해주는 hook 이다.
	// 쓰는 이유는 toggleUp 이 실행되면 state가 변경되어 전체 코드가 렌더링 되고 Y value 는 초기값 0으로 돌아가기 때문이다.
	const Y_POSITION = useRef(new Animated.Value(300)).current;
	const toggleUp = () => setUp((prev) => !prev);
	const moveUp = () => {
		Animated.timing(Y_POSITION, {
			toValue: up ? 300 : -300,
			useNativeDriver: true,
			duration: 2000,
		}).start(toggleUp);
	};
	const opacity = Y_POSITION.interpolate({
		inputRange: [-300, 0, 300],
		outputRange: [1, 0.5, 1],
	});
	const borderRadius = Y_POSITION.interpolate({
		inputRange: [-300, 300],
		outputRange: [100, 0],
	});
	return (
		<Container>
			<Pressable onPress={moveUp}>
				<AnimateBox
					style={{
						opacity,
						borderRadius,
						transform: [{ translateY: Y_POSITION }],
					}}
				/>
			</Pressable>
		</Container>
	);
}
