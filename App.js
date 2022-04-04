import React, { useRef, useState } from "react";
import { Animated, Easing } from "react-native";
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
	const Y = useRef(new Animated.Value(0)).current;
	const toggleUp = () => setUp((prev) => !prev);
	const moveUp = () => {
		Animated.timing(Y, {
			toValue: up ? 200 : -200,
			useNativeDriver: true,
			easing: Easing.linear,
		}).start(toggleUp);
	};
	Y.addListener(() => console.log("Animated State:", Y));
	console.log("Component State", Y);
	return (
		<Container>
			<TouchableOpacity onPress={moveUp}>
				<AnimateBox style={{ transform: [{ translateY: Y }] }} />
			</TouchableOpacity>
		</Container>
	);
}
