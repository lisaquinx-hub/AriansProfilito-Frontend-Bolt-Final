'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Link2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: 'completed' | 'in-progress' | 'pending';
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

const statusLabels: Record<TimelineItem['status'], string> = {
  completed: 'تکمیل‌شده',
  'in-progress': 'در حال اجرا',
  pending: 'در انتظار',
};

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const updateRadius = () => {
      setOrbitRadius(Math.max(112, Math.min(200, window.innerWidth * 0.3)));
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  useEffect(() => {
    if (!autoRotate) return;

    const rotationTimer = window.setInterval(() => {
      setRotationAngle((previous) => Number(((previous + 0.3) % 360).toFixed(3)));
    }, 50);

    return () => window.clearInterval(rotationTimer);
  }, [autoRotate]);

  const getRelatedItems = useCallback(
    (itemId: number) =>
      timelineData.find((item) => item.id === itemId)?.relatedIds ?? [],
    [timelineData]
  );

  const centerViewOnNode = useCallback(
    (nodeId: number) => {
      if (!nodeRefs.current[nodeId]) return;

      const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
      const targetAngle = (nodeIndex / timelineData.length) * 360;
      setRotationAngle(270 - targetAngle);
    },
    [timelineData]
  );

  const toggleItem = useCallback(
    (id: number) => {
      const willExpand = !expandedItems[id];

      if (willExpand) {
        const relatedPulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((relatedId) => {
          relatedPulse[relatedId] = true;
        });
        setExpandedItems({ [id]: true });
        setActiveNodeId(id);
        setAutoRotate(false);
        setPulseEffect(relatedPulse);
        centerViewOnNode(id);
        return;
      }

      setExpandedItems({});
      setActiveNodeId(null);
      setAutoRotate(true);
      setPulseEffect({});
    },
    [centerViewOnNode, expandedItems, getRelatedItems]
  );

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === containerRef.current || event.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = orbitRadius * Math.cos(radian);
    const y = orbitRadius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number) =>
    activeNodeId ? getRelatedItems(activeNodeId).includes(itemId) : false;

  const getStatusStyles = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300';
      case 'in-progress':
        return 'border-sky-500/40 bg-sky-500/15 text-sky-600 dark:text-cyan-300';
      default:
        return 'border-border bg-muted text-muted-foreground';
    }
  };

  return (
    <div
      className="relative flex h-[650px] w-full items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        ref={orbitRef}
        style={{ perspective: '1000px' }}
      >
        <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 shadow-glow animate-pulse">
          <div className="absolute h-20 w-20 animate-ping rounded-full border border-sky-500/25 opacity-70" />
          <div
            className="absolute h-24 w-24 animate-ping rounded-full border border-blue-500/15 opacity-50"
            style={{ animationDelay: '0.5s' }}
          />
          <div className="h-8 w-8 rounded-full bg-white/90 shadow-inner" />
        </div>

        <div
          className="absolute rounded-full border border-sky-500/20 dark:border-cyan-400/15"
          style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
        />

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              ref={(element) => {
                nodeRefs.current[item.id] = element;
              }}
              className="absolute cursor-pointer transition-all duration-700"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
              }}
              onClick={(event) => {
                event.stopPropagation();
                toggleItem(item.id);
              }}
            >
              <div
                className={`absolute -inset-1 rounded-full ${isPulsing ? 'animate-pulse duration-1000' : ''}`}
                style={{
                  background:
                    'radial-gradient(circle, rgba(14,165,233,0.24) 0%, rgba(14,165,233,0) 70%)',
                  width: `${item.energy * 0.5 + 40}px`,
                  height: `${item.energy * 0.5 + 40}px`,
                  left: `-${(item.energy * 0.5) / 2}px`,
                  top: `-${(item.energy * 0.5) / 2}px`,
                }}
              />

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isExpanded
                    ? 'scale-150 border-sky-400 bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : isRelated
                      ? 'animate-pulse border-cyan-400 bg-cyan-500/80 text-white'
                      : 'border-sky-500/40 bg-card text-sky-600 shadow-md dark:bg-background dark:text-cyan-300'
                }`}
              >
                <Icon size={16} />
              </div>

              <div
                className={`absolute top-12 -translate-x-1/2 whitespace-nowrap text-xs font-semibold transition-all duration-300 ${
                  isExpanded ? 'scale-125 text-sky-600 dark:text-cyan-300' : 'text-muted-foreground'
                }`}
                style={{ left: '50%' }}
              >
                {item.title}
              </div>

              {isExpanded && (
                <Card className="absolute top-20 left-1/2 w-[min(19rem,82vw)] -translate-x-1/2 overflow-visible border-sky-500/30 bg-card/95 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-sky-500/50" />
                  <CardHeader className="pb-2 text-right">
                    <div className="flex items-center justify-between gap-3">
                      <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                        {statusLabels[item.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <CardTitle className="mt-2 text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-right text-xs leading-6 text-muted-foreground">
                    <p>{item.content}</p>

                    <div className="mt-4 border-t pt-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Zap size={11} />
                          میزان پیشرفت
                        </span>
                        <span>{item.energy.toLocaleString('fa-IR')}٪</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <div className="mb-2 flex items-center gap-1 text-foreground/70">
                          <Link2 size={11} />
                          <span>مرحله‌های مرتبط</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = timelineData.find((candidate) => candidate.id === relatedId);
                            return (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 px-2 text-xs"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleItem(relatedId);
                                }}
                              >
                                {relatedItem?.title}
                                <ArrowLeft size={10} />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
