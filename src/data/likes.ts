import type { Sticker, Wallpaper } from '@/types'

/** Cycled in this order; the first is the default and always sits underneath. */
export const wallpapers: Wallpaper[] = [
  { src: '/likes/wallpapers/bliss.webp', label: 'Bliss, with a cow' },
  { src: '/likes/wallpapers/pink-xp-cat.webp', label: 'Pink XP, with a cat' },
  { src: '/likes/wallpapers/bikini-bottom-news.webp', label: 'Bikini Bottom news' },
]

/**
 * Die-cut stickers and photos on the desk, cut with `scripts/cutout.py` (see
 * docs/content.md). `x`/`y` are the resting spot in percent of the board and
 * `w` the desktop width; the section scales them down on small screens.
 */
export const stickers: Sticker[] = [
  { id: 'star', src: '/likes/stickers/star.webp', alt: 'A screaming star doodle', kind: 'cutout', iw: 428, ih: 480, w: 110, x: 46.3, y: 0.1, r: -12.5, drift: 7.0 },
  { id: 'worm-02', src: '/likes/stickers/worm-02.webp', alt: 'A pink clay worm', kind: 'cutout', iw: 356, ih: 106, w: 130, x: 68.1, y: 0.1, r: -8.8, drift: 9.5 },
  { id: 'handcuffs', src: '/likes/photos/handcuffs.webp', alt: 'A hand cuffed to a beer mug', kind: 'photo', iw: 480, ih: 480, w: 136, x: 22.8, y: 0.9, r: -7.6, drift: 7.9 },
  { id: 'tiger', src: '/likes/stickers/tiger.webp', alt: 'A fat tiger', kind: 'cutout', iw: 480, ih: 404, w: 136, x: 58.2, y: 1.0, r: -0.5, drift: 5.8 },
  { id: 'clown-worm', src: '/likes/stickers/clown-worm.webp', alt: 'A clay clown caterpillar', kind: 'cutout', iw: 480, ih: 455, w: 128, x: 80.3, y: 2.0, r: -12.8, drift: 6.1 },
  { id: 'shark', src: '/likes/stickers/shark.webp', alt: 'A shark toy in shorts', kind: 'cutout', iw: 313, ih: 480, w: 92, x: 0.5, y: 2.8, r: -0.4, drift: 8.2 },
  { id: 'pack-01', src: '/likes/stickers/pack-01.webp', alt: 'A balloon sticker: I should tell them that I am not afraid to die', kind: 'cutout', iw: 196, ih: 268, w: 92, x: 34.5, y: 3.8, r: -5.3, drift: 5.6 },
  { id: 'fish-lime', src: '/likes/stickers/fish-lime.webp', alt: 'A cutout of a running fish', kind: 'cutout', iw: 449, ih: 329, w: 126, x: 85.5, y: 5.5, r: 13.3, drift: 7.9 },
  { id: 'pack-04', src: '/likes/stickers/pack-04.webp', alt: 'A yellow poster: I bet on losing dogs', kind: 'cutout', iw: 149, ih: 222, w: 92, x: 12.2, y: 6.0, r: 12.0, drift: 9.4 },
  { id: 'pack-03', src: '/likes/stickers/pack-03.webp', alt: 'A blue stamp: stay with me and hold my hand', kind: 'cutout', iw: 182, ih: 247, w: 92, x: 57.2, y: 25.4, r: 12.4, drift: 5.6 },
  { id: 'frog', src: '/likes/stickers/frog.webp', alt: 'A frog silhouette', kind: 'cutout', iw: 480, ih: 285, w: 132, x: 80.2, y: 26.9, r: 6.6, drift: 6.0 },
  { id: 'pack-09', src: '/likes/stickers/pack-09.webp', alt: 'A red poster: a tall child', kind: 'cutout', iw: 202, ih: 246, w: 92, x: 67.6, y: 27.3, r: -2.2, drift: 9.1 },
  { id: 'gorilla-yellow', src: '/likes/stickers/gorilla-yellow.webp', alt: 'A yellow gorilla sticker', kind: 'cutout', iw: 275, ih: 280, w: 112, x: 47.1, y: 27.5, r: -12.1, drift: 6.7 },
  { id: 'poster', src: '/likes/photos/poster.webp', alt: 'A vintage poster: screw battle, we are getting drunk', kind: 'photo', iw: 342, ih: 480, w: 136, x: 35.7, y: 28.3, r: 11.6, drift: 8.5 },
  { id: 'worm-01', src: '/likes/stickers/worm-01.webp', alt: 'A pink clay worm', kind: 'cutout', iw: 333, ih: 155, w: 130, x: 85.2, y: 28.5, r: -2.9, drift: 9.5 },
  { id: 'fish-burst', src: '/likes/stickers/fish-burst.webp', alt: 'A sardine in an orange starburst', kind: 'cutout', iw: 480, ih: 318, w: 136, x: 2.3, y: 30.0, r: 1.9, drift: 6.3 },
  { id: 'fish-blue', src: '/likes/stickers/fish-blue.webp', alt: 'A blue crayon fish sticker', kind: 'cutout', iw: 480, ih: 325, w: 130, x: 11.6, y: 30.2, r: -8.2, drift: 8.0 },
  { id: 'dragon', src: '/likes/stickers/dragon.webp', alt: 'A blue dragon print', kind: 'cutout', iw: 480, ih: 414, w: 136, x: 23.9, y: 30.9, r: -10.2, drift: 7.0 },
  { id: 'dino', src: '/likes/stickers/dino.webp', alt: 'A crayon green dinosaur with stars', kind: 'cutout', iw: 473, ih: 480, w: 140, x: 13.5, y: 50.8, r: 13.2, drift: 5.9 },
  { id: 'tiger-small', src: '/likes/stickers/tiger-small.webp', alt: 'A small fuzzy tiger sticker', kind: 'cutout', iw: 254, ih: 213, w: 104, x: 87.5, y: 51.2, r: 0.3, drift: 6.5 },
  { id: 'worm-05', src: '/likes/stickers/worm-05.webp', alt: 'Two pink clay worms', kind: 'cutout', iw: 304, ih: 195, w: 130, x: 35.1, y: 52.3, r: 3.4, drift: 6.0 },
  { id: 'worm-03', src: '/likes/stickers/worm-03.webp', alt: 'A pink clay worm', kind: 'cutout', iw: 274, ih: 123, w: 130, x: 67.3, y: 52.3, r: 4.5, drift: 7.0 },
  { id: 'spongebob', src: '/likes/stickers/spongebob.webp', alt: 'A doodle of SpongeBob', kind: 'cutout', iw: 436, ih: 341, w: 126, x: 47.9, y: 53.6, r: -4.7, drift: 8.4 },
  { id: 'alien', src: '/likes/stickers/alien.webp', alt: 'A green one-eyed alien doodle', kind: 'cutout', iw: 145, ih: 171, w: 84, x: 79.0, y: 53.7, r: 2.5, drift: 9.2 },
  { id: 'pack-08', src: '/likes/stickers/pack-08.webp', alt: 'A poster: moon, tell me if I could send up my heart to you', kind: 'cutout', iw: 178, ih: 246, w: 92, x: 0.9, y: 54.2, r: -11.6, drift: 7.4 },
  { id: 'worm-04', src: '/likes/stickers/worm-04.webp', alt: 'A pink clay worm', kind: 'cutout', iw: 327, ih: 115, w: 130, x: 24.5, y: 55.0, r: -4.8, drift: 9.2 },
  { id: 'beer-buddies', src: '/likes/photos/beer-buddies.webp', alt: 'A dog and a cat holding beers on a beach', kind: 'photo', iw: 480, ih: 429, w: 136, x: 56.7, y: 55.6, r: -1.3, drift: 7.0 },
  { id: 'splat', src: '/likes/stickers/splat.webp', alt: 'A blue ink splat that says OK', kind: 'cutout', iw: 414, ih: 480, w: 118, x: 86.3, y: 69.6, r: -11.5, drift: 6.0 },
  { id: 'pack-05', src: '/likes/stickers/pack-05.webp', alt: 'A cigarette-pack poster: I do not smoke, except for when I am missing you', kind: 'cutout', iw: 159, ih: 234, w: 92, x: 78.8, y: 69.9, r: -7.0, drift: 5.7 },
  { id: 'baby', src: '/likes/photos/baby.webp', alt: 'A baby captioned im evil ashit bro', kind: 'photo', iw: 480, ih: 475, w: 136, x: 58.1, y: 70.1, r: -10.2, drift: 8.3 },
  { id: 'pink-cat', src: '/likes/stickers/pink-cat.webp', alt: 'A pink cat figurine', kind: 'cutout', iw: 420, ih: 480, w: 112, x: 47.9, y: 71.4, r: 13.6, drift: 8.6 },
  { id: 'tomato', src: '/likes/stickers/tomato.webp', alt: 'A grumpy tomato', kind: 'cutout', iw: 480, ih: 473, w: 122, x: 22.9, y: 73.0, r: 3.1, drift: 8.8 },
  { id: 'gorilla-red', src: '/likes/stickers/gorilla-red.webp', alt: 'A red gorilla sticker', kind: 'cutout', iw: 276, ih: 286, w: 112, x: 33.9, y: 73.8, r: 4.3, drift: 8.0 },
  { id: 'nugget', src: '/likes/stickers/nugget.webp', alt: 'A chicken nugget with drawn-on arms and legs', kind: 'cutout', iw: 480, ih: 460, w: 118, x: 68.6, y: 74.4, r: 3.6, drift: 7.7 },
  { id: 'pack-07', src: '/likes/stickers/pack-07.webp', alt: 'A yellow star: my body is made of crushed little stars', kind: 'cutout', iw: 342, ih: 273, w: 92, x: 3.5, y: 79.6, r: -5.3, drift: 5.6 },
]
