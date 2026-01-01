import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { sessionStore } from '../../src/lib/sessionStore';
import { deviationScore } from '../../src/lib/deviation';

function Meter({ value }: { value: number }) {
  const w = Math.max(0, Math.min(100, value));
  return (
    <View style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}>
      <Text style={{ fontWeight: '600' }}>逸脱度：{w}</Text>
      <View style={{ height: 10, borderWidth: 1, borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
        <View style={{ width: `${w}%`, height: '100%' }} />
      </View>
      <Text style={{ marginTop: 8, opacity: 0.7 }}>
        0-30: オン / 31-60: 寄り道 / 61-100: 脱線
      </Text>
    </View>
  );
}

export default function Live() {
  const plan = sessionStore.getPlan();
  const [phaseIndex, setPhaseIndex] = useState(sessionStore.getPhaseIndex());
  const [text, setText] = useState('');

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

  const result = useMemo(() => deviationScore(text, plan, phaseIndex), [text, plan, phaseIndex]);

  const returnLine = useMemo(() => {
    const lines = [
      'いまの話、課題文にすると何ですか？',
      '優先度の観点（インパクト/頻度/実現性）でどれに当たります？',
      'その話を打ち手候補として整理すると、何案目に入ります？',
      '次アクションに落とすと、誰がいつまでに何をします？',
    ];
    return lines[phaseIndex] ?? lines[0];
  }, [phaseIndex]);

  const setPhase = (i: number) => {
    setPhaseIndex(i);
    sessionStore.setPhaseIndex(i);
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>ライブ</Text>
      <Text style={{ opacity: 0.7 }}>目的：{plan.goal}</Text>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {plan.phases.map((p, i) => (
          <Pressable
            key={p.id}
            onPress={() => setPhase(i)}
            style={{ padding: 10, borderRadius: 10, borderWidth: 1, opacity: i === phaseIndex ? 1 : 0.6 }}
          >
            <Text>{i + 1}. {p.title}</Text>
          </Pressable>
        ))}
      </View>

      <Meter value={result.deviation} />
      <Text style={{ opacity: 0.8 }}>いまのフェーズ：{result.phaseTitle}</Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="いま話してる内容（仮：手入力）"
        style={{ borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 90 }}
        multiline
      />

      <Pressable onPress={() => setText('')} style={{ padding: 12, borderRadius: 10, borderWidth: 1 }}>
        <Text>入力クリア</Text>
      </Pressable>

      <View style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}>
        <Text style={{ fontWeight: '600' }}>戻す一言</Text>
        <Text style={{ marginTop: 6 }}>{returnLine}</Text>
      </View>
    </View>
  );
}
