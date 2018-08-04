/**
 * Copyright (C) 2018 Michael Czechowski <mail@dailysh.it>
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; version 2.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import { ElementRef, HostListener, Output, EventEmitter, Input, Directive, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Selection from 'd3-selection';
import * as Shape from 'd3-shape';
import * as Random from 'd3-random';
import * as Drag from 'd3-drag';

import { environment as env } from './../../environments/environment';
import { Config } from './../models/config.model';
import { Graph } from './../models/graph.model';
import { Point } from './../models/point.model';
import { Param } from './../models/param.model';
import { CanvasService } from './../services/canvas.service';

@Directive({
  selector: '[guilloche]'
})
export class GuillocheDirective implements OnChanges {

  private canvas: any;
  private group: any;

  @Input() graph: Graph;
  @Input() matrix: any;
  @Input() config: any;

  constructor(
    private canvasService: CanvasService,
    private el: ElementRef
  ) {
    this.group = Selection.select(el.nativeElement);
    this.canvas = Selection.select(this.canvasService.get);
  }

  ngOnChanges(changes: SimpleChanges) {
    const points = [this.graph.start.point, ...this.graph.nodes, this.graph.end.point];

    this.spreadLines(points);

    console.log('guilloche directive (changes)', changes.graph.currentValue);
  }

  private drawGraph(points: Point[]): void {
    this.group.append('path')
      .attr('d', Shape.line()
        .x(p => p.x)
        .y(p => p.y)
        .curve(Shape.curveBasis)(points))
      .attr('stroke', this.graph.color)
      .attr('stroke-width', this.graph.stroke)
      .attr('fill', 'none');

    if (!env.production) {
      this.showGrid();
    }

    console.log('guilloche directive(drawGraph)', this.graph);
  }

  private spreadLines(points: Point[]) {
    const indexMiddle = Math.floor(points.length * 0.5);
    const pointMiddle = points[indexMiddle];
    const closestCenter = this.getFarestCenter(pointMiddle);
    // const closestCenter = this.getClosestCenter(pointMiddle);
    const radius = this.Δ(pointMiddle, closestCenter);
    const spreadPoints = [];
    const group = this.canvas.append('g').attr('id', 'spread-points');
    const pies = 80;

    for (let i = 0; i < pies; i++) {
      spreadPoints.push({
        x: radius * Math.cos(2 * i * Math.PI / pies) + closestCenter.x,
        y: radius * Math.sin(2 * i * Math.PI / pies) + closestCenter.y,
      });
    }

    spreadPoints.sort((a, b) => {
      // return this.Δ(a, pointMiddle) - this.Δ(b, pointMiddle);
      // Good possibility to align orientation points outsite
      return this.Δ(b, pointMiddle) - this.Δ(a, pointMiddle);
    });

    spreadPoints.some((point, index) => {
      points[indexMiddle] = point;

      this.drawGraph(points);

      return index === this.config.spread - 1;
    });

    group.lower();
  }

  private getClosestCenter(point: Point) {
    if (this.Δ(point, this.matrix.start) < this.Δ(point, this.matrix.end)) {
      return this.matrix.start;
    } else {
      return this.matrix.end;
    }
  }

  private getFarestCenter(point: Point) {
    if (this.Δ(point, this.matrix.start) > this.Δ(point, this.matrix.end)) {
      return this.matrix.start;
    } else {
      return this.matrix.end;
    }
  }

  /**
   * Calculate distance between to points with coordinates.
   * @param a
   * @param b
   */
  private Δ(a: Point, b: Point) {
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 0.5);
  }

  private showGrid() {
    this.group.append('circle')
      .attr('cx', this.graph.start.point.x)
      .attr('cy', this.graph.start.point.y)
      .attr('r', 20)
      .attr('stroke-width', 1)
      .attr('fill-opacity', 0)
      .attr('stroke', this.graph.color);

    this.group.append('circle')
      .attr('cx', this.graph.end.point.x)
      .attr('cy', this.graph.end.point.y)
      .attr('r', 10)
      .attr('stroke-width', 1)
      .attr('fill-opacity', 0)
      .attr('stroke', this.graph  .color);

    this.graph.nodes.forEach(point => {
      this.group.append('circle')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('r', 5)
        .attr('stroke-width', 1)
        .attr('fill-opacity', 0)
        .attr('stroke', 'darkgray');
    });
  }
}
