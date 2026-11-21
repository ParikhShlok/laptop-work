def make_proposal(job):
    title = str(job.get("title") or "this task")
    skills = ", ".join(job.get("required_skills") or []) or "Python and data handling"
    return ("AI-assisted/template proposal — review and edit before sending.\n\n"
            f"Hello, I’m interested in helping with {title}. I can use relevant skills such as {skills} "
            "to work through the task and keep the result clear and maintainable. I would first confirm "
            "the expected inputs, desired output, and acceptance criteria, then share a small plan before proceeding.\n\n"
            "Could you clarify the expected deliverable and how you would like the result validated?")
