import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated, Easing, PanResponder } from "react-native";
import { Text, View } from "react-native";

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
	flex: 1;
	background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const WordContainer = styled(Animated.createAnimatedComponent(View))`
	background-color: ${GREY};
	width: 100px;
	height: 100px;
	justify-content: center;
	align-items: center;
	border-radius: 50px;
`;
const Word = styled(Animated.createAnimatedComponent(Text))`
	color: ${(props) => props.color};
	font-weight: 600;
	font-size: 38px;
`;
const Center = styled.View`
	flex: 3;
	justify-content: center;
	align-items: center;
	z-index: 10;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
	background-color: white;
	padding: 5px 10px;
	border-radius: 10px;
`;

export default function App() {
	// Values
	const opacity = useRef(new Animated.Value(1)).current;
	const scale = useRef(new Animated.Value(1)).current;
	const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const scaleKnow = position.y.interpolate({
		inputRange: [-300, -80],
		outputRange: [2, 1],
		extrapolate: "clamp",
	});
	const scaleDontKnow = position.y.interpolate({
		inputRange: [80, 300],
		outputRange: [1, 2],
		extrapolate: "clamp",
	});
	// Animations
	const onPressIn = Animated.spring(scale, {
		toValue: 0.9,
		useNativeDriver: true,
	});

	const onPressOut = Animated.spring(scale, {
		toValue: 1,
		useNativeDriver: true,
	});
	const goHome = Animated.spring(position, {
		toValue: 0,
		useNativeDriver: true,
	});
	const onDropScale = Animated.timing(scale, {
		toValue: 0,
		duration: 50,
		easing: Easing.linear,
		useNativeDriver: true,
	});
	const onDropOpacity = Animated.timing(opacity, {
		toValue: 0,
		duration: 50,
		easing: Easing.linear,
		useNativeDriver: true,
	});
	// Pan Responders
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				onPressIn.start();
			},
			onPanResponderMove: (_, { dx, dy }) => {
				position.setValue({ x: dx, y: dy });
			},
			onPanResponderRelease: (_, { dy }) => {
				if (dy < -250 || dy > 250) {
					Animated.sequence([
						Animated.parallel([onDropScale, onDropOpacity]),
						Animated.timing(position, {
							toValue: 0,
							useNativeDriver: true,
							duration: 80,
							easing: Easing.linear,
						}),
					]).start();
				} else {
					Animated.parallel([goHome, onPressOut]).start();
				}
			},
		})
	).current;
	// State

	return (
		<Container>
			<Edge>
				<WordContainer style={{ transform: [{ scale: scaleKnow }] }}>
					<Word color={GREEN}>알아</Word>
				</WordContainer>
			</Edge>
			<Center>
				<IconCard
					{...panResponder.panHandlers}
					style={{
						opacity,
						transform: [...position.getTranslateTransform(), { scale }],
					}}
				>
					<Ionicons name="beer" color={GREY} size={120} />
				</IconCard>
			</Center>
			<Edge>
				<WordContainer style={{ transform: [{ scale: scaleDontKnow }] }}>
					<Word color={RED}>몰라</Word>
				</WordContainer>
			</Edge>
		</Container>
	);
}
