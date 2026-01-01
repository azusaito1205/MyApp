import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { sessionStore } from '../../src/lib/sessionStore';

export default function Edit() {
  const plan = sessionStore.getPlan();
  const [minutes, setMinutes] = useState(plan?.phases.map(p => String(p.minutes)) ?? ['10','10','15','10']);

  if (!plan) {
    return (
      <View style={{ padding: 16 }}>
        <Text>プランがないため戻ります</Text>
        <Pressable onPress={() => router.replace('/')} style={{ padding: 12, borderRadius: 10, borderWidth: 1 }}>
          <Text>目的入力へ</Text>
        </Pressable>
      </View>
    );
  }

  const onSave = () => {
    const next = {
      ...plan,
      phases: plan.phases.map((p, i) => ({ ...p, minutes: Number(minutes[i] || p.minutes) })),
    };
    sessionStore.setPlan(next);
    router.push('/live');
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>変更（まずは時間だけ）</Text>

      {plan.phases.map((p, i) => (
        <View key={p.id} style={{ borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>{p.title}</Text>
          <TextInput
            value={minutes[i]}
            onChangeText={(v) => setMinutes(prev => prev.map((x, idx) => (idx === i ? v : x)))}
            keyboardType="number-pad"
            style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}
            placeholder="分"
          />
        </View>
      ))}

      <Pressable onPress={onSave} style={{ padding: 12, borderRadius: 10, borderWidth: 1 }}>
        <Text>保存して開始</Text>
      </Pressable>
    </View>
  );
}
