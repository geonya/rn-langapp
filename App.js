import React, { useRef } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
	background-color: white;
	width: 300px;
	height: 300px;
	justify-content: center;
	align-items: center;
	border-radius: 12px;
	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

export default function App() {
	// Values
	const scale = useRef(new Animated.Value(1)).current;
	const position = useRef(new Animated.Value(0)).current;
	const rotation = position.interpolate({
		inputRange: [-250, 250],
		outputRange: ["-15deg", "15deg"],
		extrapolate: "clamp", //input이 범위 밖으로 벗어났을 때 clamp 옵션은 더이상 진행을 제한함
	});
	//Animations
	const onPressIn = Animated.spring(scale, {
		toValue: 0.95,
		useNativeDriver: true,
	});
	const onPressOut = Animated.spring(scale, {
		toValue: 1,
		useNativeDriver: true,
	});
	const goCenter = Animated.spring(position, {
		toValue: 0,
		useNativeDriver: true,
	});
	// Pan Responders
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, { dx }) => {
				position.setValue(dx);
			},
			onPanResponderGrant: () => onPressIn.start(),
			onPanResponderRelease: (_, { dx }) => {
				if (dx < -300) {
					Animated.spring(position, {
						toValue: -400,
						useNativeDriver: true,
					}).start();
				} else if (dx > 300) {
					Animated.spring(position, {
						toValue: 400,
						useNativeDriver: true,
					}).start();
				} else {
					Animated.parallel([onPressOut, goCenter]).start();
				}
			},
		})
	).current;

	return (
		<Container>
			<Card
				{...panResponder.panHandlers}
				style={{
					transform: [
						{ scale },
						{ translateX: position },
						{ rotateZ: rotation },
					],
				}}
			>
				<Ionicons name="pizza" color="#34495e" size={98} />
			</Card>
		</Container>
	);
}
