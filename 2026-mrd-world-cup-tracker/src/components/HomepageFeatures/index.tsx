import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Live Score Tracking',
    description: (
      <>
        Enter scores for all 54 games across the group stage and bracket. Standings,
        rankings, and bracket pairings update instantly as you type.
      </>
    ),
  },
  {
    title: 'Automatic Bracket Resolution',
    description: (
      <>
        Seeds like G1–G24, WQ1, LQ2, WS1 are resolved automatically from entered
        scores. No manual bracket updates needed — the app handles the full seed
        resolution chain from group stage through to the Final.
      </>
    ),
  },
  {
    title: 'Share Your Scores',
    description: (
      <>
        Export the current score state to JSON and share it with others, or import
        a file to load someone else's score state. Scores are also saved locally
        and survive page refresh.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md" style={{paddingTop: '2rem'}}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
