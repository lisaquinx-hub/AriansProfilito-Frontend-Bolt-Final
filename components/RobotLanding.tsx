import { InteractiveRobotSpline } from '@/components/InteractiveRobotSpline';

const ROBOT_SCENE_PROXY = '/api/spline/robot';

export default function RobotLanding() {
  return (
    <section
      aria-label="ربات تعاملی آریان‌لب"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-transparent pt-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_PROXY}
        className="relative z-10 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
