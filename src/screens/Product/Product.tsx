import React, { useRef } from "react";
import { Dimensions, Image, TextStyle, View } from "react-native";
import Animated from "react-native-reanimated";
import { interpolateColor, useScrollHandler } from "react-native-redash";

import Container from "../../components/Container";
import { Review } from "../../components/Product";

import theme from "../../utils/theme";
import Dot from "../Onboarding/Dot";

const SLIDER_WIDTH = Dimensions.get("screen").width;

const slides = [{ color: theme.colors.shades.gray_20 }, { color: theme.colors.shades.gray }];
const textColors = [{ color: theme.colors.shades.gray_80 }, { color: theme.colors.shades.white }];

const Product = () => {
	const sliderRef = useRef<Animated.ScrollView>(null);

	const { scrollHandler, x } = useScrollHandler();

	const backgroundColor = interpolateColor(x, {
		inputRange: slides.map((_, i) => i * SLIDER_WIDTH),
		outputRange: slides.map((_) => _.color),
	});

	const textColor = interpolateColor(x, {
		inputRange: textColors.map((_, i) => i * SLIDER_WIDTH),
		outputRange: textColors.map((_) => _.color),
	});

	return (
		<Container avoidTopNotch={true} avoidHomBar={false}>
			{() => {
				return (
					<>
						{/* Slider  */}
						<Animated.View style={{ flex: 0.9, backgroundColor } as any}>
							<Animated.ScrollView
								horizontal
								ref={sliderRef}
								bounces={false}
								showsHorizontalScrollIndicator={false}
								decelerationRate="fast"
								snapToInterval={SLIDER_WIDTH}
								{...scrollHandler}>
								<View style={{ width: SLIDER_WIDTH, justifyContent: "center", alignItems: "center" }}>
									<Image source={require("../../assets/images/example/product-sample.png")} />
								</View>
								<View style={{ width: SLIDER_WIDTH, justifyContent: "center", alignItems: "center" }}>
									<Image source={require("../../assets/images/example/product-sample.png")} />
								</View>
							</Animated.ScrollView>
							{/* Product Content */}
							<View
								style={{
									paddingHorizontal: theme.spacing.medium,
									paddingVertical: theme.spacing.small,
									position: "absolute",
									width: "100%",
									bottom: 0,
									height: 130,
									justifyContent: "space-between",
								}}>
								{/* Slider Indicators */}
								<View style={[theme.rowStyle, { justifyContent: "center", width: "100%" }]}>
									{slides.map((_, index) => {
										return <Dot key={index} currentIndex={index} width={SLIDER_WIDTH} scrollX={x} mh={index === 1 ? 6 : 0} />;
									})}
								</View>
								{/* Product Info */}
								<View>
									<Animated.Text style={[theme.textStyles.h4, { color: textColor, marginBottom: theme.spacing.xxSmall }] as TextStyle[]}>
										Xbox One Elite Series 2 Controller
									</Animated.Text>
									<Review stars={2} color={textColor} />
								</View>
							</View>
						</Animated.View>
					</>
				);
			}}
		</Container>
	);
};

export default Product;