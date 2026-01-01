import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { sessionStore } from '../../src/lib/sessionStore';

export default function Confirm() {
  const plan = sessionStore.getPlan();

  if (!plan) {
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Text>プランが見つからないので戻ります</Text>
        <Pressable onPress={() => router.replace('/')} style={{ padding: 12, borderRadius: 10, borderWidth: 1 }}>
          <Text>目的入力へ</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>目的を4つのステップに分けました</Text>
      <Text>目的：{plan.goal}</Text>

      <View style={{ gap: 8 }}>
        {plan.phases.map(p => (
          <View key={p.id} style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontWeight: '600' }}>{p.title}（{p.minutes}分）</Text>
            <Text style={{ opacity: 0.7 }}>アンカー：{p.anchors.join(' / ')}</Text>
          </View>
        ))}
      </View>

      <Text style={{ marginTop: 8 }}>このままスタートしますか？それとも変えますか？</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => router.push('/live')} style={{ flex: 1, padding: 12, borderRadius: 10, borderWidth: 1 }}>
          <Text>✅ このまま開始</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/edit')} style={{ flex: 1, padding: 12, borderRadius: 10, borderWidth: 1 }}>
          <Text>✏️ 変える</Text>
        </Pressable>
      </View>
    </View>
  );
}
