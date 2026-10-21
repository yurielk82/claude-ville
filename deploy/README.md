# 운영 (ville.dvsharp.com)

이 fork 는 dvsharp 서버에서 ClaudeVille 을 상시 띄우기 위한 것이다. 원본은 `upstream`(honorstudio/claude-ville).

- 서비스: `claude-ville.service`(system, `tools.slice`) → `127.0.0.1:4000`. 기본 바인딩이 127.0.0.1 이고 `HOST`·`PORT` 로 바꾼다.
- 공개: Cloudflare DNS → CloudFront → nginx(`ville.dvsharp.com.conf`, basic auth) → 4000.
- 계정: 사용자 `ville`, 평문 `~/.config/secrets/claude-ville-basic-auth`(0600), 해시 `/etc/nginx/auth/claude-ville.htpasswd`.
- 배포: 중앙 등록부(global-rules `targets/projects.tsv` 의 `claude-ville`). 빌드 없이 체크아웃을 맞추고 재시작한다.
- 원본 따라가기: `git fetch upstream && git merge upstream/main` 을 브랜치에서 하고 PR 로 병합한다.
- 시험: `npm test`(node:test, 의존성 없음). CircleCI 는 아직 연결하지 않았다.

설치 명령은 각 파일 머리말에 있다.
