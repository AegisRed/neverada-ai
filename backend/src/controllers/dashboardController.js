/**
 * Returns demo dashboard data for the authenticated user.
 * In a real app these numbers would be aggregated from the DB.
 */
export function dashboard(req, res) {
  res.json({
    user: req.user,
    kpis: [
      { key: "Задач выполнено", value: "12 847", trend: "+18%", up: true, icon: "check" },
      { key: "Активных агентов", value: "7", trend: "+2", up: true, icon: "bot" },
      { key: "Сэкономлено часов", value: "342", trend: "+27%", up: true, icon: "clock" },
      { key: "Успешность", value: "99.2%", trend: "+0.4%", up: true, icon: "chart" },
    ],
    activity: [42, 58, 51, 73, 66, 89, 78, 95, 84, 102, 96, 118],
    agents: [
      { name: "Sales Outreach", desc: "Автоматизация холодных писем", status: "active", initials: "SO" },
      { name: "Support Triage", desc: "Классификация тикетов", status: "active", initials: "ST" },
      { name: "Content Writer", desc: "Генерация статей блога", status: "paused", initials: "CW" },
      { name: "Data Analyst", desc: "Отчёты по метрикам", status: "active", initials: "DA" },
      { name: "Lead Scorer", desc: "Скоринг входящих лидов", status: "draft", initials: "LS" },
    ],
  });
}
