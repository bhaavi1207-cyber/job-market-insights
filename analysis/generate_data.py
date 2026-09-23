"""Generate a sample job-postings dataset for the dashboard.

The dataset is synthetic so the project runs offline with no API keys.
Regenerate with:  python3 generate_data.py
"""
import csv, random
from datetime import date, timedelta

random.seed(42)

ROLES = {
    "Frontend Developer": (["React", "JavaScript", "TypeScript", "CSS", "HTML", "Redux", "Tailwind"], 3, 9),
    "Backend Developer": (["Node.js", "Python", "SQL", "Docker", "AWS", "PostgreSQL", "REST APIs"], 4, 11),
    "Full Stack Developer": (["React", "Node.js", "SQL", "TypeScript", "AWS", "MongoDB"], 5, 12),
    "Data Analyst": (["SQL", "Python", "Excel", "Tableau", "Power BI", "Pandas"], 3, 8),
    "Data Scientist": (["Python", "Machine Learning", "SQL", "Pandas", "TensorFlow", "Statistics"], 5, 13),
    "DevOps Engineer": (["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"], 5, 12),
    "UI/UX Designer": (["Figma", "Prototyping", "User Research", "Wireframing", "Adobe XD"], 3, 8),
}
CITIES = [("Bengaluru", .30), ("Hyderabad", .15), ("Pune", .12), ("Mumbai", .12),
          ("Delhi NCR", .11), ("Chennai", .08), ("Remote", .12)]
TYPES = [("Full-time", .68), ("Internship", .14), ("Contract", .10), ("Part-time", .08)]
SOURCES = [("LinkedIn", .40), ("Wellfound", .25), ("Naukri", .20), ("Indeed", .15)]

def pick(weighted):
    r = random.random(); acc = 0
    for val, w in weighted:
        acc += w
        if r <= acc: return val
    return weighted[-1][0]

rows = []
start = date(2026, 1, 1)
for i in range(600):
    role = random.choice(list(ROLES))
    skills, lo, hi = ROLES[role]
    posted = start + timedelta(days=random.randint(0, 240))
    n_skills = random.randint(2, min(5, len(skills)))
    rows.append({
        "job_id": f"J{i+1001}",
        "title": role,
        "company_type": random.choice(["Startup", "Mid-size", "Enterprise"]),
        "location": pick(CITIES),
        "job_type": pick(TYPES),
        "source": pick(SOURCES),
        "salary_lpa": round(random.uniform(lo, hi), 1),
        "experience_years": random.choice([0, 0, 1, 1, 2, 3, 4, 5]),
        "skills": ";".join(random.sample(skills, n_skills)),
        "posted_date": posted.isoformat(),
    })

with open("data/job_postings.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)
print(f"Wrote {len(rows)} rows to data/job_postings.csv")
