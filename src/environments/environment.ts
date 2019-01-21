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

export const environment = {
  production: false,
  debug: false,
  animation: false,
  config: {
    colors: {
      secondary: '#F8485E',
      primary: '#5CC0C7'
    }
  },
  formDefaults: {
    debug: false,
    margin: {
      x: 0.02,
      y: 0
    },
    overlap: 0.9,
    vectors: {
      start: 1,
      end: 0,
      range: 0.5,
      spacing: 5
    },
    nodes: 8,
    stroke: 0.6,
    spread: {
      amount: 60,
      spacing: 30
    },
    interval: 3000
  }
};
