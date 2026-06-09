import type { Doctor } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: 'miyazawa',
    name: { name: '宮澤先生', description: '院長' },
    procedures: [
      {
        id: 'miyazawa-ext',
        name: 'EXT',
        items: ['基本セット', '外科サクション', '手用の浸麻', '生食', '滅菌ガーゼ4枚'],
        notes: '院長はEXTの際、特に止血に注意するためガーゼを多めに準備します。'
      },
      {
        id: 'miyazawa-imp',
        name: 'IMP',
        items: ['基本セット', '印象シリコンセット', '印象用トレー', 'シェードガイド', '技工所のSDカード', '指示書']
      }
    ]
  },
  {
    id: 'shibata',
    name: '柴田先生',
    procedures: [
      {
        id: 'shibata-end-tek',
        name: 'エンド後TEK',
        items: [{ name: '基本セット', '口角鉤', '咬合面用ミラー', '5倍速', description: '柴田バーセット' }, { name: 'コントラ', description: 'ホワイトポイント' }, { name: '即重', description: '粉・液・柴田筆・シャーペン' }, { name: 'ストレート', description: 'バー：金のカーバイドバー・銀' }, { name: '咬合紙', description: '赤青1枚ずつ' }, 'ハード'],
        notes: '連結の際はディスクも使うときもあります。テーブルトップの際はデュラシール。'
      },
      {
        id: 'shibata-imp',
        name: 'IMP',
        items: [{ name: '基本セット', '浸麻', '5倍速', description: '柴田バーセット' }, { name: 'コントラ', description: 'ホワイトポイント' }, { name: '圧排糸', 'ジンパッカー', '印象シリコンセット', '印象用トレー', 'シェードガイド', '技工所のSDカード', 'ハード', description: 'クラウン時' }, { name: 'デュラシール', description: 'インレー・アンレー・テーブルトップ時' }, '口角鉤', '指示書']
      },
      {
        id: 'shibata-set',
        name: 'SET',
        items: [{ name: '基本セット', '浸麻', description: '使わない時もある' }, { name: '超音波スケーラー', 'ズー', 'サンドブラスト', 'コントラ', description: '白の研磨バー・ホワイトポイント' }, { name: 'ブラシ', 'パナビアセット', description: '筆・ガーゼ・セメント・ペースト・前処理' }, { name: '咬合紙', description: '赤青3枚ずつ' }, 'フロス', '照射器'],
        conditionalItems: [
          {
            condition: 'インレーSET時の追加',
            items: ['フォーステップスセット', 'ラバーダム', 'ラバーパンチ', 'クランプ', 'ハサミ']
          }
        ],
        checkItems: ['前処理の方法は、先生が最新のやり方を常に勉強して更新していくので、都度確認した方が良いです。']
      }
    ]
  },
  {
    id: 'shinano',
    name: '信濃先生',
    procedures: [
      {
        id: 'shinano-end-tek',
        name: 'エンド後TEK',
        items: [{ name: '基本セット', '5倍速', description: '銀のバーセット' }, { name: 'コントラ', description: 'カーボランダム' }, { name: 'ストレート', description: 'バー：金・銀・白' }, { name: '口角鉤', '咬合紙', description: '赤青1枚ずつ' }, { name: '即重', description: '粉・液・筆・ワセリン' }, '咬合面用ミラー', '側方用ミラー', 'ハード'],
        notes: '即重はアシストが1歯に対して10滴でこねて渡す。ハードで接着後も側方用ミラーで写真撮影（5枚法以上）。'
      }
    ]
  },
  {
    id: 'yayama',
    name: '矢山先生',
    procedures: [
      {
        id: 'yayama-ext',
        name: 'EXT',
        items: [{ name: '基本セット', '外科サクション', '手用の浸麻', '鋭匙', '反っているヘーベル', '生食', '滅菌ガーゼ4枚', '剥離子', '日大式ヘーベル', 'メスNo.15c', '滅菌ストレート', description: 'バー：太めのフィッシャー・大きめのラウンド' }, { name: '縫合糸', description: 'マニーの5-0ナイロン' }, '縫合セット'],
        checkItems: ['鉗子は言われたら出す（全部と言われたら、埋伏は基本出す）。'],
        notes: '表麻はボトルだけ置いておく。伝達麻酔は下顎埋伏時のみ。'
      }
    ]
  }
];
