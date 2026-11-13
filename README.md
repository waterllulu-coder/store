# 김명자 옷장

인스타그램 `@toda.y9797` 링크인바이오용 코디 스토어입니다. 영상(회차) 탭에서 룩을 고르고, 룩마다 착장 사진과 에이블리 상품 카드가 붙어 있습니다.

라이브 주소: https://waterllulu-coder.github.io/store/

정적 HTML/CSS/JS만 사용합니다. 빌드 과정은 없습니다. 로컬에서 보려면 이 폴더에서 웹 서버를 띄우면 됩니다.

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. `file://`로 바로 열면 `data.json`을 못 불러올 수 있습니다.

## 콘텐츠 추가 방법

이 페이지에는 **인스타그램에 이미 게시한 릴스의 룩만** 올립니다. 초안이거나 아직 올리지 않은 영상은 `data.json`과 이미지에 넣지 마세요. 새 룩은 해당 릴스를 게시한 뒤에만 추가합니다.

모든 룩·상품은 [`data.json`](data.json) 한 파일에서 읽습니다. 새 영상이 게시되면 `episodes` 배열 **맨 앞**에 회차를 추가하세요(최신순). 이미지 파일은 `images/looks/`, `images/products/`에 넣고 경로만 JSON에 적습니다.

권장 이미지: WebP 또는 JPG, 긴 변 약 800px.

상품 링크는 사장님 크리에이터 계정에서 만든 `https://applink.a-bly.com/...` 수수료 링크를 우선 씁니다. 아직 없으면 `https://m.a-bly.com/goods/<상품번호>`를 넣고, `hasApplink`를 `false`로 둡니다.

## data.json 스키마

```json
{
  "store": {
    "title": "김명자 옷장",
    "subtitle": "영상 속 그 옷, 룩 번호로 찾아보세요",
    "instagram": "toda.y9797",
    "instagramUrl": "https://www.instagram.com/toda.y9797/",
    "disclosure": "[광고] 이 페이지의 링크로 구매 시 수수료를 받을 수 있어요",
    "aiNote": "AI 가상 착용 이미지 · 사진 출처: 에이블리 각 샵",
    "priceNote": "가격은 조사 시점 기준이며 바뀔 수 있어요."
  },
  "episodes": [
    {
      "id": "unique-episode-id",
      "tab": "탭에 보이는 짧은 이름 (예: LOOK 1~2, LOOK 3~4)",
      "title": "그 영상 훅/상황 한 줄",
      "date": "YYYY-MM-DD",
      "priceAsOf": "YYYY-MM-DD",
      "reelUrl": "https://www.instagram.com/toda.y9797/reel/.../ 또는 null",
      "looks": [
        {
          "id": "unique-look-id",
          "label": "LOOK 1",
          "title": "룩 제목",
          "still": "images/looks/example.webp",
          "products": [
            {
              "id": "에이블리 상품번호",
              "name": "상품명",
              "shop": "샵명",
              "option": "색 / 사이즈 등",
              "price": 51050,
              "priceLabel": "51,050원",
              "image": "images/products/32009593.webp",
              "url": "https://applink.a-bly.com/... 또는 https://m.a-bly.com/goods/<id>",
              "hasApplink": true
            }
          ]
        }
      ]
    }
  ]
}
```

필드 설명:

| 경로 | 필수 | 설명 |
|---|---|---|
| `store.*` | 예 | 헤더·푸터 문구. 바꾸면 페이지 상단/하단 문구가 같이 바뀝니다. |
| `episodes[].id` | 예 | 회차 고유값. 영문·숫자·하이픈 권장. |
| `episodes[].tab` | 예 | 가로 알약 탭 라벨. |
| `episodes[].title` | 예 | 탭 아래 제목(영상 훅 문장). |
| `episodes[].date` | 아니요 | 회차 날짜. `2026.11.10` 형식으로 표시됩니다. |
| `episodes[].priceAsOf` | 아니요 | 가격 조사일(페이지에는 안 나옵니다). |
| `episodes[].reelUrl` | 아니요 | 인스타 릴스 주소. 있으면 「영상 보기」 링크가 붙습니다. |
| `looks[].id` | 예 | 룩 고유값. |
| `looks[].label` | 예 | 룩 번호 라벨. |
| `looks[].title` | 예 | 룩 제목. |
| `looks[].still` | 예 | 모델 착장 이미지 경로. |
| `products[].id` | 예 | 에이블리 상품 번호(`sno`). |
| `products[].name` | 예 | 상품명. 검색에 사용됩니다. |
| `products[].shop` | 예 | 샵명. |
| `products[].option` | 아니요 | 색·기장 등. |
| `products[].price` | 예 | 숫자 가격(원). |
| `products[].priceLabel` | 예 | 화면에 그대로 나가는 가격 문자열. |
| `products[].image` | 예 | 상품 이미지 경로. |
| `products[].url` | 예 | 「보러가기」 링크. |
| `products[].hasApplink` | 예 | 수수료 링크 여부. 업데이트 시 구분용이며 화면에는 안 나옵니다. |

검색창은 룩 이름, 탭/회차 제목, 상품명, 샵명, 옵션을 대상으로 필터링합니다. 검색어가 있으면 탭 구분 없이 맞는 룩을 모두 보여 줍니다.

## 배포

GitHub 저장소 `waterllulu-coder/store`의 `main` 브랜치 루트를 GitHub Pages로 제공합니다. `data.json`이나 이미지만 고친 뒤 커밋하고 푸시하면 됩니다.

```bash
git add data.json images
git commit -m "Add a new look"
git push origin main
```

## 표기

페이지 상단과 하단에 아래 문구가 항상 보입니다.

- `[광고] 이 페이지의 링크로 구매 시 수수료를 받을 수 있어요`
- `AI 가상 착용 이미지 · 사진 출처: 에이블리 각 샵`
