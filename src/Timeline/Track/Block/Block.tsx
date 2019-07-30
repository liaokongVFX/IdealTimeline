import React from 'react';
import { 
  Rect,
  Group
} from 'react-konva';
import { Vector2d } from 'konva/types/types';
import { KonvaEventObject } from 'konva/types/Node';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number,
  height: number
}

export interface IBlockFunctions {
  moveBlock: (trackId: number, blockId: number, newStart: number) => void,
  trimBlock: (trackId: number, blockId: number, startDelta: number, durationDelta: number) => void
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  layerId: number
}

const scale = 1;
const handleWidth = 6;


class Block extends React.Component<IBlockProps> {

  state = {      

  }

  constrainDrag = (pos: Vector2d) => {
    return ({
      x: pos.x,
      y: 0
    });
  }

  

  render = () => {
    const x = this.props.start * scale;
    const width = this.props.duration * scale;
    return (
      <Group
        draggable={true}
        dragBoundFunc={this.constrainDrag}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => { this.props.moveBlock(this.props.layerId, this.props.id, e.currentTarget.attrs.x) }}
        x={x}
        >
        <Rect 
        x={0}
          y={0}
          width={width}
          height={this.props.height}
          fill={"#ff0000"}
        />
        <Rect
          x={width}
          y={0}
          width={handleWidth}
          height={this.props.height}
          fill={"#333333"}
          draggable={true}
          dragBoundFunc={this.constrainDrag}
          onDragMove={(e: KonvaEventObject<DragEvent>) => { this.props.trimBlock(this.props.layerId, this.props.id, 0, e.currentTarget.attrs.x - width)}}
        />
      </Group>
    )
  }
  
}

export default Block;