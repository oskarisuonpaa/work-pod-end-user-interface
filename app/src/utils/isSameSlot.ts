const isSameSlot = (
  a: { start: string; end: string },
  b: { start: string; end: string }
): boolean => {
  return (
    new Date(a.start).getTime() === new Date(b.start).getTime() &&
    new Date(a.end).getTime() === new Date(b.end).getTime()
  );
};

export default isSameSlot;
