export const sections = [
  [
    "1. 기본 정보",
    [
      {
        "name": "company",
        "label": "회사명 또는 브랜드명",
        "hint": "개인 의뢰는 성함 또는 활동명",
        "required": true,
        "kind": "text",
        "options": []
      },
      {
        "name": "name",
        "label": "담당자 이름",
        "hint": "",
        "required": true,
        "kind": "text",
        "options": []
      },
      {
        "name": "phone",
        "label": "연락처",
        "hint": "",
        "required": true,
        "kind": "text",
        "options": []
      },
      {
        "name": "email",
        "label": "이메일 주소",
        "hint": "견적 및 프로젝트 안내를 받을 주소",
        "required": true,
        "kind": "email",
        "options": []
      },
      {
        "name": "projectType",
        "label": "의뢰 분야",
        "hint": "",
        "required": true,
        "kind": "select",
        "options": [
          "일러스트",
          "캐릭터",
          "키비주얼",
          "기타"
        ]
      },
      {
        "name": "projectTypeOther",
        "label": "기타 의뢰 분야",
        "hint": "기타를 선택한 경우 직접 작성해주세요.",
        "required": false,
        "kind": "text",
        "options": []
      }
    ]
  ],
  [
    "2. 프로젝트 배경과 목표",
    [
      {
        "name": "background",
        "label": "의뢰 배경",
        "hint": "이번 작업이 필요하게 된 배경을 알려주세요.",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "goal",
        "label": "프로젝트 목표",
        "hint": "전달하고 싶은 메시지나 달성하고 싶은 목표를 알려주세요.",
        "required": true,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "audience",
        "label": "주요 대상",
        "hint": "결과물을 보거나 사용하는 대상은 누구인가요?",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "description",
        "label": "프로젝트 설명",
        "hint": "프로젝트 내용과 결과물의 사용처를 설명해주세요. (예: 브랜드 캠페인, 제품 패키지, 홈페이지, SNS, 출판물)",
        "required": true,
        "kind": "textarea",
        "options": []
      }
    ]
  ],
  [
    "3. 요청하는 작업 범위",
    [
      {
        "name": "quantity",
        "label": "일러스트 컷수 또는 작업 수량",
        "hint": "예: 메인 이미지 1컷 + 소형 일러스트 3컷",
        "required": true,
        "kind": "text",
        "options": []
      },
      {
        "name": "size",
        "label": "작업 사이즈",
        "hint": "가로 × 세로와 단위를 작성해주세요. (예: 200 × 200mm / 1920 × 1080px)",
        "required": false,
        "kind": "text",
        "options": []
      },
      {
        "name": "resolution",
        "label": "해상도",
        "hint": "필요한 해상도가 있다면 작성해주세요. (예: 300dpi)",
        "required": false,
        "kind": "text",
        "options": []
      },
      {
        "name": "formats",
        "label": "요청 파일 형식",
        "hint": "기본 납품 형식은 PSD입니다. 추가로 필요한 형식을 선택해주세요.",
        "required": false,
        "kind": "checkbox",
        "options": [
          "PSD만 필요",
          "JPG 추가",
          "PNG 추가",
          "기타",
          "협의 필요"
        ]
      },
      {
        "name": "formatOther",
        "label": "기타 파일 형식",
        "hint": "추가로 필요한 파일 형식을 작성해주세요.",
        "required": false,
        "kind": "text",
        "options": []
      }
    ]
  ],
  [
    "4. 참고 자료와 원하는 방향",
    [
      {
        "name": "style",
        "label": "BOOxBOO 작업 중 원하는 스타일",
        "hint": "BOOxBOO 그림 중 이번 프로젝트에서 진행하고 싶은 스타일의 이미지를 첨부해주세요. (이미지 대신 작업물 링크도 가능) 특히 마음에 드는 점이 있다면 함께 알려주세요. (예: 색감, 선의 느낌, 캐릭터 표현, 분위기)",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "styleImage",
        "label": "원하는 스타일 이미지",
        "hint": "이미지 또는 위 입력란의 작업물 링크 중 하나는 필수입니다.",
        "required": false,
        "kind": "file",
        "options": []
      },
      {
        "name": "reference",
        "label": "추가 참고 자료 — 선택",
        "hint": "그 외 참고하고 싶은 레퍼런스 링크와 참고할 부분을 알려주세요.",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "referenceFile",
        "label": "추가 참고 자료 파일",
        "hint": "",
        "required": false,
        "kind": "file",
        "options": []
      },
      {
        "name": "requests",
        "label": "기타 작업 요청 사항",
        "hint": "배경 유무, 컷별 내용, 추가 버전 등 필요한 사항을 작성해주세요.",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "avoid",
        "label": "피하고 싶은 방향 또는 작업 시 주의할 점",
        "hint": "원하지 않는 표현이나 유의해야 할 사항을 알려주세요.",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "guide",
        "label": "브랜드 가이드 또는 필수 규격",
        "hint": "반드시 지켜야 하는 기준을 작성해주세요. (예: 지정 컬러, 로고 사용 규칙, 필수 문구 / 관련 링크 첨부 가능)",
        "required": false,
        "kind": "textarea",
        "options": []
      },
      {
        "name": "guideFile",
        "label": "브랜드 가이드 파일",
        "hint": "",
        "required": false,
        "kind": "file",
        "options": []
      }
    ]
  ],
  [
    "5. 작업 일정",
    [
      {
        "name": "meeting",
        "label": "사전 미팅 희망 여부",
        "hint": "",
        "required": true,
        "kind": "select",
        "options": [
          "미팅 희망",
          "미팅 불필요",
          "협의 후 결정"
        ]
      },
      {
        "name": "meetingTime",
        "label": "미팅 희망 날짜와 시간",
        "hint": "미팅을 희망하는 경우 가능한 날짜와 시간을 작성해주세요.",
        "required": false,
        "kind": "text",
        "options": []
      },
      {
        "name": "start",
        "label": "작업 시작 희망일",
        "hint": "대략적인 일정, 미정 또는 협의 필요로 작성해도 괜찮습니다.",
        "required": true,
        "kind": "text",
        "options": []
      },
      {
        "name": "deadline",
        "label": "최종 납품 희망일",
        "hint": "일정은 대략적으로 작성해도 괜찮습니다. 반드시 지켜야 하는 마감은 별도로 표시해주세요.",
        "required": true,
        "kind": "text",
        "options": []
      }
    ]
  ],
  [
    "6. 예산",
    [
      {
        "name": "budget",
        "label": "예상 예산 또는 예산 범위",
        "hint": "금액과 부가세 포함 여부를 작성해주세요. (예: 100만~150만 원, 부가세 별도 / 견적 확인 후 협의)",
        "required": true,
        "kind": "text",
        "options": []
      }
    ]
  ]
] as const;
