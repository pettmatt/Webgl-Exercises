const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());

const settings = {
  // With suffix I can include more text into the file name when it's saved
  suffix: 's_' + random.getSeed(),
  dimensions: [2048, 2048]
};

console.log('Currend seed:', random.getSeed())

const sketch = () => {
  const colourCount = random.rangeFloor(2, 6);
  /* Pick a palette from library, shuffle the given array, take 1 to x amount
    of colours and we get a random result of colour palette every time. */
  const palette = random.shuffle(random.pick(palettes).slice(0, colourCount));

  const createGrid = () => {
    const points = [];
    const count = 27;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = Math.abs(random.noise2D(u, v) * 0.1);

        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v) * 1,
          position: [u, v]
        });
      }
    }
    return points;
  }

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        rotation
      } = data;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${ radius * width }px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('=', 0, 0);

      context.restore();
    });
  }
};

canvasSketch(sketch, settings);
