import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{title: "Home"}}/>
    </Stack>
  )

}

// options trong Stack.Screen là gì 
// options là một đối tượng chứa các tùy chọn cấu hình cho
// Stack.Screen, cho phép bạn tùy chỉnh các thuộc tính