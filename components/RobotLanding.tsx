import { InteractiveRobotSpline } from '@/components/InteractiveRobotSpline';

const DEFAULT_ROBOT_SCENE =
  'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

export default function RobotLanding() {
  const scene = process.env.NEXT_PUBLIC_SPLINE_ROBOT_SCENE || DEFAULT_ROBOT_SCENE;

  return (
    <section
      aria-label="ربات تعاملی آریان‌لب"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-background pt-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <InteractiveRobotSpline scene={scene} className="relative z-10 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
