# 성공 대화론 독서모임

비즈니스 코치 독서모임을 위한 진행판입니다. 책 문장, 성찰, AI 질문 카드, 대화 기록을 한 화면에서 다룹니다.

## GitHub Pages 배포

1. 이 프로젝트를 GitHub 저장소에 올립니다.
2. GitHub 저장소의 `Settings > Pages`로 이동합니다.
3. `Build and deployment`의 `Source`를 `GitHub Actions`로 선택합니다.
4. `main` 브랜치에 push하면 `.github/workflows/deploy-github-pages.yml`가 자동으로 배포합니다.

일반 저장소는 `https://계정.github.io/저장소명/` 주소로 열립니다. `계정.github.io` 저장소를 쓰면 루트 주소로 열립니다.

## 로컬 확인

```bash
npm install
npm run dev:github
```

정적 배포용 빌드는 아래 명령으로 확인합니다.

```bash
npm run build:github
```

## 사용 흐름

- 발제 코치 3명을 탭으로 선택합니다.
- 각 코치는 책에서 붙잡은 문장, 성찰, 현장 사례를 짧게 적습니다.
- AI 질문 카드는 요약 자료 대신 대화를 여는 질문을 제안합니다.
- 대화 기록에서 남길 말을 표시하면 마무리 영역에 모입니다.
- 큰 글씨 모드와 인쇄 기능을 제공합니다.
