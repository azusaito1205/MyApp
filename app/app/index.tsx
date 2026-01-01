import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { generatePlan } from '../../src/lib/planGenerator';
import { sessionStore } from '../../src/lib/sessionStore';

export default function Index() {
  const [goal, setGoal] = useState('リサーチで抽出した課題に対する打ち手を考える');

  const onNext = () => {
    const plan = generatePlan(goal.trim());
    sessionStore.setPlan(plan);
    router.push('/confirm');
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>目的を入力</Text>

      <TextInput
        value={goal}
        onChangeText={setGoal}
        placeholder="例：リサーチ課題に対する打ち手を考える"
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

      <Pressable onPress={onNext} style={{ padding: 12, borderRadius: 10, borderWidth: 1 }}>
        <Text>自動で4分解して確認する</Text>
      </Pressable>
    </View>
  );
}
