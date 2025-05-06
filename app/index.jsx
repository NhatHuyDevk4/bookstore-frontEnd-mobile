import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={style.container}
    >
      <Text>
        Hello
      </Text>
      <Link href="/(auth)/signup">Signup</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
