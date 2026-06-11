import type { AssistantStep } from '../types';

export const manualStepsData: Record<string, AssistantStep[]> = {
  'MTA': [
    { id: 'm1', stepNumber: 1, description: 'ガラス練板の上に、MTAセメントを出す(少量ずつ)' },
    { id: 'm2', stepNumber: 2, description: 'ガラス練板の上に滅菌精製水を数滴垂らす' },
    { id: 'm3', stepNumber: 3, description: 'ガラス練板の上で、MTAセメントと滅菌精製水を混ぜ合わせていく', note: '一気に滅菌精製水を全部混ぜると緩くなるので、滅菌精製水はここでも少しずつ混ぜていく!!' },
    { id: 'm4', stepNumber: 4, description: '混ぜ合わせたら、スパチュラを使ってキャリアに圧接していく。', note: 'ネチョっとするぐらいの柔らかさ。硬すぎてもダメだし、緩すぎてもダメ。' },
    { id: 'm5', stepNumber: 5, description: 'プラガーですくっていく', note: '硬さが適切でないと上手く取ることができない!! キャリアからすくう時は、プラガーを平行に押す。' },
    { id: 'm6', stepNumber: 6, description: 'MTAの作業を数回繰り返し、綿球の指示がでたら綿球を渡す', note: 'エンド基本セットに出している綿球を自分でもっと小さくしてピンセットで掴んで渡す。' }
  ],
  'パテタイプのMTA': [
    { id: 'pm1', stepNumber: 1, description: 'キャリアの上にパテを少量出す' },
    { id: 'pm2', stepNumber: 2, description: 'スパチュラで圧接していく', note: 'パテの場合は、何かと混ぜたりすることはないので、ガンから出したものをそのまま圧接していくだけでOK' },
    { id: 'pm3', stepNumber: 3, description: 'プラガーですくっていく', note: 'キャリアからすくう時は、平行に押すようにすくっていく。' }
  ],
  'RCF': [
    { id: 'r1', stepNumber: 1, description: 'ウェルパルプSTを渡す', note: '先端を新しいのに変えておく。Drに渡す時は新品の先端の方を渡す。' },
    { id: 'r2', stepNumber: 2, description: 'ウェルパルプSTをレンツロに付けて渡す' },
    { id: 'r3', stepNumber: 3, description: '指示されたGPをGPピンセットでつかんで、ウェルパルプSTを付けて渡す', note: 'GPは必ず間違えないように、使う号数を声に出して渡す(35の04です)。' },
    { id: 'r4', stepNumber: 4, description: 'アルファを渡す', note: 'アルファの先端の取り付ける向きを確認。上顎の時は左、下顎の時は右。高温なので、ガーゼでふき取る時は2~3枚重ねるように!!' },
    { id: 'r5', stepNumber: 5, description: 'プラガーを渡す', note: '黒と青を使う。メモリの付いてる方を使用するので渡す向き確認。' },
    { id: 'r6', stepNumber: 6, description: '根管が複数ある場合は③④⑤を繰り返し行う' },
    { id: 'r7', stepNumber: 7, description: 'ゼネシスを渡す', note: 'ゼネシスは温度が上昇するまで時間がかかるので、アルファを使うタイミングで電源をON。' },
    { id: 'r8', stepNumber: 8, description: '超音波で洗い、乾燥させる' },
    { id: 'r9', stepNumber: 9, description: 'プラガーで修正する' }
  ],
  'コア築': [
    { id: 'c1', stepNumber: 1, description: 'サンドブラスト', note: '患者に声掛けをして目元にタオルをかける。酸化アルミナがかなり飛ぶので口腔外バキューム必須。' },
    { id: 'c2', stepNumber: 2, description: 'アクセル', note: 'マイクロアプリケーターにアクセルを付けて渡す。乾燥後、EDTA・滅菌精製水で洗浄し再度乾燥させる。' },
    { id: 'c3', stepNumber: 3, description: 'イーライズプライマー', note: 'マイクロアプリケーターにイーライズプライマーを付けて渡す。その後、しっかり乾燥させる。' },
    { id: 'c4', stepNumber: 4, description: 'イーライズデンティン(ボンディング)', note: '一滴ずつ混合させてマイクロアプリケーターでよく混ぜてDrに渡す。乾燥後、アシストが照射をする。' },
    { id: 'c5', stepNumber: 5, description: 'ビューティコアで土台を立てていく', note: 'まずは黄(27G)から。詰まりやすいので詰まったら交換。次に赤(18G)。' }
  ],
  'Zr・レジンコア除去': [
    { id: 'z1', stepNumber: 1, description: '麻酔（表面麻酔、麻酔）' },
    { id: 'z2', stepNumber: 2, description: 'Zr、セラミッククラウン除去', note: 'タービン、TR-19、クラウンスプレッダー、リムーバーを使用。' },
    { id: 'z3', stepNumber: 3, description: 'レジンコア除去', note: 'タービン、BR-31、ニュートロンの除去用のE7D。この時には全部は除去せず、残りはラバーダムをした状態で行う。' },
    { id: 'z4', stepNumber: 4, description: 'カリエス除去', note: 'タービン、バーセット、コントラ(言われたら出す)。' }
  ],
  'TEK調整': [
    { id: 't1', stepNumber: 1, description: 'TEKの内面をくり抜いていく', note: 'ラウンドバー、フィッシャーを使用。' },
    { id: 't2', stepNumber: 2, description: '即重を使って調整する場合（指示があれば）', note: 'アシスト側で液を9滴入れておく。Drが粉を入れてスパチュラで練る。' },
    { id: 't3', stepNumber: 3, description: '硬化したら、外してストレートで調整していく' },
    { id: 't4', stepNumber: 4, description: '咬合紙で咬合の確認' },
    { id: 't5', stepNumber: 5, description: 'ハードセメントにて装着する', note: 'セメントは多めに盛る。溢れたセメントを3wayで洗うのでバキューム必要。ロールワッテを噛んでもらって3分硬化。' }
  ]
};
