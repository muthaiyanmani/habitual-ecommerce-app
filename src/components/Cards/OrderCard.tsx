import React from "react";
import { Dimensions, View, Image, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Animated, { Easing } from "react-native-reanimated";
import { useValue } from "react-native-redash";
import dayjs from "dayjs";

import { generateBoxShadowStyle } from "../../utils";
import { CartItem } from "../../utils/store";
import theme, { rgba } from "../../utils/theme";
import { OrderStatus } from "../../utils/types";

interface OrderCard {
	orders: Record<string, CartItem>;
	amount: string;
	date: string;
	status: OrderStatus;
}

export const ORDER_CARD_WIDTH = Dimensions.get("screen").width - theme.spacing.medium * 2;

const getStatusText = (status: OrderStatus) => {
	switch (status) {
		case OrderStatus.INPROCESS:
			return { text: "Preparing to ship", color: theme.colors.shades.gray_60 };
		case OrderStatus.SHIPPED:
			return { text: "Almost there!", color: theme.colors.shades.gray_80 };
		case OrderStatus.DELIVERED:
			return { text: "Delivered", color: theme.colors.accents.teal };
	}
};

const OrderCard = (props: OrderCard) => {
	const rotateAnimate = useValue(0);
	const [showCompleteDetail, setShowCompleteDetail] = React.useState(false);

	const { text, color } = getStatusText(props.status);
	const totalCartItems = Object.keys(props.orders).length;
	const [id, order] = Object.entries(props.orders)[0];
	const title = totalCartItems > 1 ? `${totalCartItems} products purchased` : `${props.orders[id].product.title}`;

	const toggleDetails = () => {
		setShowCompleteDetail(!showCompleteDetail);
		Animated.timing(rotateAnimate, {
			duration: 100,
			toValue: showCompleteDetail ? 0 : 1,
			easing: Easing.ease,
		}).start();
	};

	const rotate = rotateAnimate.interpolate({
		inputRange: [0, 1],
		outputRange: ["0 deg", "180 deg"],
	});

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: order.product.image }} style={{ width: "80%", height: "80%" }} resizeMode="contain" />
			</View>
			<View style={{ width: "70%", marginLeft: theme.spacing.small }}>
				<View style={[theme.rowStyle, { alignItems: "center", position: "relative" }]}>
					<Text style={theme.textStyles.body_reg}>{title}</Text>
					{totalCartItems > 1 && (
						<Animated.View style={{ position: "absolute", right: theme.spacing.small, transform: [{ rotate }] }}>
							<Pressable style={{ padding: theme.spacing.xSmall }} onPress={toggleDetails}>
								<FontAwesomeIcon icon={faAngleDown as IconProp} color={theme.colors.shades.gray_80} />
							</Pressable>
						</Animated.View>
					)}
				</View>
				{totalCartItems > 1 && showCompleteDetail && (
					<View style={{ marginVertical: theme.spacing.xxSmall }}>
						{Object.keys(props.orders).map((product, index) => {
							const item = props.orders[product];
							return (
								<Text
									key={`${id}_${index}`}
									style={[theme.textStyles.body_sm, { fontFamily: theme.fonts.lato.regular, marginBottom: theme.spacing.xxSmall / 2 }]}>
									{item.product.title} x {item.quantity} (${item.product.price})
								</Text>
							);
						})}
					</View>
				)}
				<Text style={[theme.textStyles.h6, { marginVertical: theme.spacing.xxSmall }]}>${props.amount}</Text>
				<View style={{ marginVertical: theme.spacing.xxSmall }}>
					<Text style={[theme.textStyles.body_sm, { color }]}>Order placed on</Text>
					<Text style={[theme.textStyles.body_sm, { color }]}>
						{dayjs(props.date).format("DD MMM YYYY")} at {dayjs(props.date).format("HH:mm a")}
					</Text>
				</View>
				<Text style={[theme.textStyles.link_reg, { color }]}>{text}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: ORDER_CARD_WIDTH,
		marginHorizontal: theme.spacing.medium,
		padding: theme.spacing.small,
		backgroundColor: theme.colors.shades.white,
		minHeight: 120,
		borderRadius: 10,
		marginVertical: theme.spacing.xxSmall,
		flexDirection: "row",
		alignItems: "center",
		...generateBoxShadowStyle(0, 10, rgba.black(0.06), 1, 10, 10, rgba.black(1)),
	},
	imageContainer: {
		width: "30%",
		height: 88,
		borderRadius: 10,
		backgroundColor: theme.colors.shades.gray_20,
		justifyContent: "center",
		alignItems: "center",
		...generateBoxShadowStyle(0, 10, rgba.black(0.09), 1, 20, 10, rgba.black(1)),
	},
});

export default OrderCard;
