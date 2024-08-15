import clipper from 'clipper2-wasm';
import type { MainModule } from 'clipper2-wasm';

// @ts-ignore
const Clipper: MainModule = await clipper({
  locateFile: (file) => `/${file}`
})
const pathd = new Clipper.PathD();
pathd.push_back(createPointD(0, 0));
pathd.push_back(createPointD(0, 100));
pathd.push_back(createPointD(100, 100));
pathd.push_back(createPointD(100, 0));
pathd.push_back(createPointD(0, 0));
const pathd2 = new Clipper.PathD();
pathd2.push_back(createPointD(50, 50));
pathd2.push_back(createPointD(50, 150));
pathd2.push_back(createPointD(150, 150));
pathd2.push_back(createPointD(150, 50));
pathd2.push_back(createPointD(50, 50));

const pathsD = new Clipper.PathsD();
pathsD.push_back(pathd);
const pathsD2 = new Clipper.PathsD();
pathsD2.push_back(pathd2);
const res = Clipper.BooleanOpD(Clipper.ClipType.Union, { value: 1 }, pathsD, pathsD2, 1)
console.log(res.get(0).size());
const path = res.get(0);


  for (let j = 0;j<path.size();j++) {
    const point = path.get(j);
    console.log(point.x, point.y);
  }



function createPointD(x: number, y: number, z?: number) {
  return new Clipper.PointD(x, y, z ?? 1)
}

