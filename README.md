# Project 02: End-to-End CI/CD Pipeline (GitHub Actions + Trivy + Docker Hub)

একটি সম্পূর্ণ অটোমেটেড **CI/CD & DevSecOps** পাইপলাইন। GitHub-এ কোড পুশ করলেই অটোমেটিক কোড টেস্ট, **Trivy** দিয়ে Docker ইমেজ সিকিউরিটি স্ক্যান এবং স্ক্যান পাস করলে **Docker Hub**-এ ভার্সন ট্যাগসহ ইমেজ পুশ হয়।

## Pipeline Architecture

```text
Git Push / Pull Request (main or v* tag)
   │
   ▼
[ Job 1: Test ] ──► Node.js 20 + npm lint + Unit & Integration Tests
   │ (Pass)
   ▼
[ Job 2: Build & Scan ] ──► Docker Build + Trivy Vulnerability Scan (CRITICAL/HIGH)
   │ (Pass & Push to main/tag)
   ▼
[ Job 3: Push to Docker Hub ] ──► Auto-tag (latest, sha-xxxx, v1.0.0) & Push
```

---

## ১. লোকাল মেশিনে (WSL Ubuntu) টেস্ট করার নিয়ম

১. প্রজেক্টের `app` ফোল্ডারে যান:
```bash
cd /mnt/e/DevOps/DevOps_Practice/devops-portfolio-projects/02-cicd-github-actions-dockerhub/app
```

২. ডিপেন্ডেন্সি ইনস্টল করে লিন্ট ও ইউনিট টেস্ট চালান:
```bash
npm install
npm run lint
npm test
```

৩. Docker ইমেজ বিল্ড ও রান করে টেস্ট করুন:
```bash
docker build -t devops-cicd-demo:local .
docker run -d -p 3000:3000 --name cicd-test devops-cicd-demo:local
curl http://localhost:3000/health
curl "http://localhost:3000/api/sum?a=10&b=20"
docker rm -f cicd-test
```

*(ঐচ্ছিক)* WSL-এ Trivy ইনস্টল থাকলে লোকাল স্ক্যানও চালাতে পারেন:
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL devops-cicd-demo:local
```

---

## ২. GitHub Actions + Docker Hub সেটআপ গাইড

> **গুরুত্বপূর্ণ:** GitHub Actions কাজ করার জন্য `.github/workflows/ci-cd.yml` ফাইলটি আপনার GitHub রিপোজিটরির **root** ফোল্ডারে থাকতে হবে। তাই এই `02-cicd-github-actions-dockerhub` ফোল্ডারটিকে আলাদা একটি GitHub রিপোজিটরি হিসেবে পুশ করা সবচেয়ে ভালো।

### ধাপ ক: Docker Hub Access Token তৈরি
1. Docker Hub-এ লগইন করে **Account Settings → Security (Personal Access Tokens)**-এ যান।
2. **New Access Token** তৈরি করুন (`Read & Write` পারমিশনসহ) এবং টোকেনটি কপি করে রাখুন।

### ধাপ খ: GitHub Repository Secrets যোগ করা
1. GitHub-এ আপনার রিপোজিটরির **Settings → Secrets and variables → Actions**-এ যান।
2. **New repository secret** বাটনে ক্লিক করে নিচের ২টি Secret যোগ করুন:
   - `DOCKERHUB_USERNAME` → আপনার Docker Hub ইউজারনেম
   - `DOCKERHUB_TOKEN` → কপি করা Access Token

### ধাপ গ: GitHub-এ Push করা
```bash
cd /mnt/e/DevOps/DevOps_Practice/devops-portfolio-projects/02-cicd-github-actions-dockerhub
git init
git add .
git commit -m "feat: add Node.js app with GitHub Actions CI/CD and Trivy scan"
git branch -M main
git remote add origin https://github.com/<your-username>/devops-cicd-pipeline.git
git push -u origin main
```
এবার GitHub রিপোজিটরির **Actions** ট্যাবে গিয়ে লাইভ পাইপলাইন রান হতে দেখুন! রিলিজ ট্যাগ টেস্ট করতে চাইলে:
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## CV / Resume-তে লেখার জন্য Bullet Points

- *Engineered an automated CI/CD pipeline using GitHub Actions to run automated linting, unit/integration tests, and multi-stage Docker builds.*
- *Integrated Trivy container vulnerability scanning into the CI pipeline to block images with fixable CRITICAL/HIGH CVEs before registry publishing.*
- *Automated semantic versioning (`v*`), commit-SHA tagging, and Buildx layer caching to publish production images to Docker Hub.*
