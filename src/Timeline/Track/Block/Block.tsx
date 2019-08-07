import React from 'react';
import './Block.scss';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number,
}

export enum CursorType {
  default = 'default',
  move = 'grab',
  moving = 'grabbing',
  resize = 'ew-resize'
}

export interface IBlockFunctions {
  moveBlock: (trackId: number, blockId: number, newStart: number) => void,
  moveTargetPosition: (newPosition: number | null) => void,
  trimBlock: (trackId: number, blockId: number, startDelta: number, durationDelta: number) => void,
  changeCursor: (style: CursorType) => void,
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  layerId: number,
  height: number,
  scale: { x: number, y: number },
  offset: { x: number, y: number }
}

const HANDLE_WIDTH = 10;


class Block extends React.Component<IBlockProps> {

  private ref: React.RefObject<HTMLDivElement> = React.createRef();

  state = {
    dragging: false,
    dragStartOffset: 0
  }
  

  constrainDrag = (pos: { x: number, y: number }) => {
    return ({
      x: pos.x >= 0 ? pos.x : 0,
      y: this.props.height * this.props.layerId
    });
  }

  offsetInBlock = (mouseX: number) => {
    if (this.ref) {
      const thisBlock = this.ref.current;
      if (thisBlock) {
        const blockX = thisBlock.getBoundingClientRect().left;
        return blockX - mouseX;
      }
    }
  }

  render = () => {
    const x = this.props.start * this.props.scale.x;
    const width = this.props.duration * this.props.scale.x;
    const height = this.props.height;

    const style = {
      width,
      height,
      left: x
    }

    return (
      <div
        ref={this.ref}
        className="block"
        style={style}
        draggable={true}
        onDragStart={(e: React.DragEvent) => {
          this.setState({ dragStartOffset: this.offsetInBlock(e.clientX) });
        }}
        onDrag={(e: any) => {
          if (this.ref) {
            const thisBlock = this.ref.current;
            if (thisBlock) {
              // console.log('dragging, element absolute', thisBlock.getBoundingClientRect());
            }
          }
          this.props.changeCursor(CursorType.moving);
          const x = e.clientX / this.props.scale.x;
          this.props.moveTargetPosition(x);
        }}
        onDragEnd={(e: any) => {
          const x = (e.clientX - this.props.offset.x + this.state.dragStartOffset) / this.props.scale.x;
          this.props.moveBlock(this.props.layerId, this.props.id, x);
          this.props.moveTargetPosition(null);
          this.props.changeCursor(CursorType.move);
        }}
      >
        <div className="name">
          {this.props.name}
        </div>
        <div
          key="trim-right"
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
        <div
          key="trim-left"
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
      </div>
    )
  }
  
}

export default Block;