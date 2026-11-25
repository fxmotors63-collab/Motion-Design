import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './brand';
import {Main, SEQUENCES, TOTAL, WithSafe} from './Main';
import {BlackWeek, BW} from './BlackWeek';

export const Root: React.FC = () => (
  <>
    <Composition id="BlackWeek" component={() => (<WithSafe><BlackWeek /></WithSafe>)} durationInFrames={BW.total} fps={FPS} width={W} height={H} />
    <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{variant: 'A' as const}} />
    <Composition id="MainB" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{variant: 'B' as const}} />
    {SEQUENCES.map(({id, comp: C, dur}) => (
      <Composition key={id} id={id} component={() => (<WithSafe><C /></WithSafe>)} durationInFrames={dur} fps={FPS} width={W} height={H} />
    ))}
  </>
);
