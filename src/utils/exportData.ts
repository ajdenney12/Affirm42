import jsPDF from 'jspdf';

export const exportAffirmationsToPDF = (affirmations: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('My Affirmations', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

  let yPosition = 45;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;

  doc.setFontSize(12);

  affirmations.forEach((affirmation, index) => {
    const lines = doc.splitTextToSize(affirmation.text, 170);
    const lineHeight = 7;
    const blockHeight = lines.length * lineHeight + 5;

    if (yPosition + blockHeight > pageHeight - marginBottom) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${index + 1}.`, 15, yPosition);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(lines, 25, yPosition);

    yPosition += blockHeight + 5;
  });

  doc.save('nextself-affirmations.pdf');
};

export const exportAffirmationsToCSV = (affirmations: any[]) => {
  const headers = ['Number', 'Affirmation', 'Date Created'];
  const rows = affirmations.map((affirmation, index) => [
    index + 1,
    `"${affirmation.text.replace(/"/g, '""')}"`,
    new Date(affirmation.timestamp).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'nextself-affirmations.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportGoalsToPDF = (goals: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('My Goals', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

  let yPosition = 45;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;

  goals.forEach((goal, index) => {
    if (yPosition > pageHeight - marginBottom - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${goal.title}`, 15, yPosition);
    yPosition += 8;

    if (goal.description) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const descLines = doc.splitTextToSize(goal.description, 170);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 5 + 3;
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    if (goal.type === 'progress') {
      doc.text(`Progress: ${goal.current}/${goal.target} (${Math.round((goal.current / goal.target) * 100)}%)`, 20, yPosition);
      yPosition += 6;
    } else if (goal.type === 'habit') {
      const streak = calculateStreakForExport(goal.habit_days);
      doc.text(`Habit: ${goal.current}/${goal.target} days | Current Streak: ${streak} days`, 20, yPosition);
      yPosition += 6;
    } else if (goal.type === 'milestone') {
      doc.text(`Milestones: ${goal.current}/${goal.milestones?.length || 0} completed`, 20, yPosition);
      yPosition += 6;

      if (goal.milestones && goal.milestones.length > 0) {
        goal.milestones.forEach((milestone: any) => {
          doc.setFontSize(9);
          doc.text(
            `${milestone.completed ? '✓' : '○'} ${milestone.text}`,
            25,
            yPosition
          );
          yPosition += 5;
        });
      }
    }

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Status: ${goal.status}`, 20, yPosition);
    yPosition += 12;
  });

  doc.save('nextself-goals.pdf');
};

export const exportGoalsToCSV = (goals: any[]) => {
  const headers = ['Goal Title', 'Description', 'Type', 'Progress', 'Status', 'Date Created'];
  const rows = goals.map(goal => {
    let progress = '';
    if (goal.type === 'progress') {
      progress = `${goal.current}/${goal.target} (${Math.round((goal.current / goal.target) * 100)}%)`;
    } else if (goal.type === 'habit') {
      progress = `${goal.current}/${goal.target} days`;
    } else if (goal.type === 'milestone') {
      progress = `${goal.current}/${goal.milestones?.length || 0} milestones`;
    }

    return [
      `"${goal.title.replace(/"/g, '""')}"`,
      `"${(goal.description || '').replace(/"/g, '""')}"`,
      goal.type,
      `"${progress}"`,
      goal.status,
      new Date(goal.created_at).toLocaleDateString()
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'nextself-goals.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportAllDataToPDF = (affirmations: any[], goals: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text('NextSelf - My Data', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

  let yPosition = 45;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;

  doc.setFontSize(16);
  doc.text('Affirmations', 15, yPosition);
  yPosition += 10;

  doc.setFontSize(12);

  if (affirmations.length === 0) {
    doc.setTextColor(100, 100, 100);
    doc.text('No affirmations yet', 20, yPosition);
    yPosition += 10;
  } else {
    affirmations.forEach((affirmation, index) => {
      const lines = doc.splitTextToSize(affirmation.text, 170);
      const lineHeight = 7;
      const blockHeight = lines.length * lineHeight + 5;

      if (yPosition + blockHeight > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${index + 1}.`, 15, yPosition);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(lines, 25, yPosition);

      yPosition += blockHeight + 5;
    });
  }

  yPosition += 10;

  if (yPosition > pageHeight - marginBottom - 30) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.text('Goals', 15, yPosition);
  yPosition += 10;

  if (goals.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No goals yet', 20, yPosition);
  } else {
    goals.forEach((goal, index) => {
      if (yPosition > pageHeight - marginBottom - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${goal.title}`, 15, yPosition);
      yPosition += 8;

      if (goal.description) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const descLines = doc.splitTextToSize(goal.description, 170);
        doc.text(descLines, 20, yPosition);
        yPosition += descLines.length * 5 + 3;
      }

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      if (goal.type === 'progress') {
        doc.text(`Progress: ${goal.current}/${goal.target} (${Math.round((goal.current / goal.target) * 100)}%)`, 20, yPosition);
        yPosition += 6;
      } else if (goal.type === 'habit') {
        const streak = calculateStreakForExport(goal.habit_days);
        doc.text(`Habit: ${goal.current}/${goal.target} days | Current Streak: ${streak} days`, 20, yPosition);
        yPosition += 6;
      } else if (goal.type === 'milestone') {
        doc.text(`Milestones: ${goal.current}/${goal.milestones?.length || 0} completed`, 20, yPosition);
        yPosition += 6;

        if (goal.milestones && goal.milestones.length > 0) {
          goal.milestones.forEach((milestone: any) => {
            doc.setFontSize(9);
            doc.text(
              `${milestone.completed ? '✓' : '○'} ${milestone.text}`,
              25,
              yPosition
            );
            yPosition += 5;
          });
        }
      }

      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Status: ${goal.status}`, 20, yPosition);
      yPosition += 12;
    });
  }

  doc.save('nextself-complete-data.pdf');
};

export const exportAllDataToCSV = (affirmations: any[], goals: any[]) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const affirmationsHeaders = ['Type', 'Number', 'Content', 'Date Created'];
  const affirmationsRows = affirmations.map((affirmation, index) => [
    'Affirmation',
    index + 1,
    `"${affirmation.text.replace(/"/g, '""')}"`,
    new Date(affirmation.timestamp).toLocaleDateString()
  ]);

  const goalsRows = goals.map((goal, index) => {
    let progress = '';
    if (goal.type === 'progress') {
      progress = `${goal.current}/${goal.target} (${Math.round((goal.current / goal.target) * 100)}%)`;
    } else if (goal.type === 'habit') {
      progress = `${goal.current}/${goal.target} days`;
    } else if (goal.type === 'milestone') {
      progress = `${goal.current}/${goal.milestones?.length || 0} milestones`;
    }

    return [
      'Goal',
      index + 1,
      `"${goal.title.replace(/"/g, '""')}${goal.description ? ' - ' + goal.description.replace(/"/g, '""') : ''}"`,
      `"${progress} | Status: ${goal.status}"`
    ];
  });

  const csvContent = [
    affirmationsHeaders.join(','),
    ...affirmationsRows.map(row => row.join(',')),
    ...goalsRows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `nextself-complete-data-${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

function calculateStreakForExport(habitDays: string[] | null): number {
  if (!habitDays || habitDays.length === 0) return 0;

  const sortedDays = [...habitDays].sort().reverse();
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let day of sortedDays) {
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - dayDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
