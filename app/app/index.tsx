import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-night px-6">
      <Text className="text-4xl font-bold text-signal">InfoRoute Loiret</Text>
      <Text className="mt-3 text-center text-base text-white">
        Sache avant de partir. Carte et fil d'alertes à venir.
      </Text>
    </View>
  );
}
