import React, { useRef, useState } from "react";
import { Animated, PanResponder, View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: #00a8ff;
`;

const CardContainer = styled.View`
	flex: 3;
	justify-content: center;
	align-items: center;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
	background-color: white;
	width: 300px;
	height: 300px;
	justify-content: center;
	align-items: center;
	border-radius: 12px;
	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
	position: absolute;
`;
const BtnContainer = styled.View`
	flex: 1;
	flex-direction: row;
`;
const Btn = styled.TouchableOpacity`
	margin: 0 10px;
`;

export default function App() {
	// Values
	const scale = useRef(new Animated.Value(1)).current;
	const position = useRef(new Animated.Value(0)).current;
	const rotation = position.interpolate({
		inputRange: [-250, 250],
		outputRange: ["-15deg", "15deg"],
	});
	const secondScale = position.interpolate({
		inputRange: [-300, 0, 300],
		outputRange: [1, 0.7, 1],
		extrapolate: "clamp",
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
	const goLeft = Animated.spring(position, {
		toValue: -SCREEN_WIDTH - 200,
		tension: 5,
		useNativeDriver: true,
		restSpeedThreshold: 100,
		restDisplacementThreshold: 100,
	});
	const goRight = Animated.spring(position, {
		toValue: SCREEN_WIDTH + 200,
		tension: 5,
		useNativeDriver: true,
		restSpeedThreshold: 100, // 애니메이션이 끝난걸로 간주할 시간
		restDisplacementThreshold: 100, // 애니메이션이 끝갈 걸로 간주하는 거리
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
				if (dx < -220) {
					goLeft.start(onDismiss);
				} else if (dx > 220) {
					goRight.start(onDismiss);
				} else {
					Animated.parallel([onPressOut, goCenter]).start();
				}
			},
		})
	).current;
	// State
	const [index, setIndex] = useState(0);
	const onDismiss = () => {
		scale.setValue(1);
		position.setValue(0); // setValue 덕분에 즉시 바뀜
		setIndex((prev) => prev + 1);
	};
	const closePress = () => {
		goLeft.start(onDismiss);
	};
	const checkPress = () => {
		goRight.start(onDismiss);
	};
	return (
		<Container>
			<CardContainer>
				<Card style={{ transform: [{ scale: secondScale }] }}>
					<Ionicons name={icons[index + 1]} color="#34495e" size={98} />
				</Card>
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
					<Ionicons name={icons[index]} color="#34495e" size={98} />
				</Card>
			</CardContainer>
			<BtnContainer>
				<Btn onPress={closePress}>
					<Ionicons name="close-circle" color="white" size={58} />
				</Btn>
				<Btn onPress={checkPress}>
					<Ionicons name="checkmark-circle" color="white" size={58} />
				</Btn>
			</BtnContainer>
		</Container>
	);
}
