/**
 * @fileoverview Peer-Reviewed Publication Metadata (IEEE ICNPCV 2026).
 */

export const PUBLICATIONS = Object.freeze([
  {
    id: 'icnpcv-2026-intelli-eye',
    badges: [
      { label: 'IEEE Paper', variant: 'ieee', icon: 'layers' },
      { label: 'ICNPCV 2026 • Bangalore ', variant: 'conf' }
    ],
    presentationDate: 'Presentation Date: July 17–18, 2026',
    title:
      'Intelli-Eye: A Holistic Deep-Learning Architecture for Predictive Threat Analysis and Intelligent Alert Automation',
    venue: {
      conference:
        '2026 International Conference on Natural Language Processing and Computer Vision (ICNPCV)',
      metadata:
        'IEEE Bangalore Section • IEEE Catalog / CFP26CV9-ART • ISBN: 979-8-3315-9284-4 • ©2026 IEEE'
    },
    abstractSegments: [
      { text: 'Abstract: ', strong: true },
      {
        text: 'Prevailing automated public safety systems suffer from high computational overhead and an inability to holistically detect disparate threat classes. The proposed '
      },
      { text: 'Intelli-Eye', strong: true },
      {
        text: ' architecture introduces a unified pipeline coupling fine-tuned YOLOv8 CNN models for overt threats with a YOLOv8-Pose skeletal heuristic engine for human behavioral dynamics (Euclidean keypoint velocity and cumulative risk scoring with exponential decay). Empirical evaluations confirm a '
      },
      { text: 'mean average precision (mAP@0.5) of 91.3%', strong: true },
      { text: ' with real-time Telegram/SMS dispatch and automated incident archiving.' }
    ],
    metrics: [
      { value: '91.3%', label: 'System mAP@0.5' },
      { value: '96.3%', label: 'Weapons (0.984 AUC)' },
      { value: '92.7%', label: 'Fire & Smoke (0.967 AUC)' },
      { value: '86.8%', label: 'Pose Theft Engine' }
    ],
    pdf: {
      title: 'Intelli-Eye: Research Paper (PDF)',
      badgeLabel: 'IEEE ICNPCV ’26',
      url: 'assets/documents/intelli-eye-paper.pdf',
      downloadName: 'Intelli-Eye_IEEE_ICNPCV_2026.pdf'
    }
  }
]);

