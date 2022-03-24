class Nim {
  constructor(initial = [1, 3, 5, 7]) {
    this.piles = initial;
    this.player = 0;
    this.winner = null;
  }
  available_actions(piles) {
    // impliment range like for python
    function* range(start, stop, step = 1) {
      if (stop == null) {
        // one param defined
        stop = start;
        start = 0;
      }

      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
      }
    }

    const actions = new Set();
    for (let i = 0; i < piles.length; i++) {
      const element = piles[i];
      for (let j of range(1, element + 1)) {
        let tuple = Object.freeze([i, j]);
        actions.add(tuple);
      }
    }
    return actions;
  }
  other_player(playes) {
    return playes === 1 ? 0 : 1;
  }
  switch_player() {
    this.player = this.other_player(this.player);
  }
  move(pile, count) {
    if (this.winner !== null) {
      throw new Error("Game already won");
    } else if (pile < 0 || pile >= this.piles.length) {
      throw new Error("Invalid pile");
    } else if (count < 1 || count > this.piles[pile]) {
      throw new Error("Invalid number of objects");
    }
    // update pile
    this.piles[pile] -= count;
    this.switch_player();

    // check for a winner
    if (this.piles.every((e) => e === 0)) this.winner = this.player;
  }
}

class NimAI {
  constructor(alpha = 0.5, epsilon = 0.1) {
    this.q = new Object();
    this.alpha = alpha;
    this.epsilon = epsilon;
  }
  update(old_state, action, new_state, reward) {
    const old = this.get_q_value(old_state, action);
    const best_future = this.best_future_reward(new_state);
    this.update_q_value(old_state, action, old, reward, best_future);
  }
  get_q_value(state, action) {
    const a = state;
    const b = [a, action];
    if (b.includes(Object.keys(this.q))) {
      return 0;
    } else {
      return this.q[b];
    }
  }
  update_q_value(state, action, old_q, reward, future_rewards) {
    const a = state;
    const b = [a, action];
    this.q[b] = old_q + this.alpha * (reward + future_rewards - old_q);
  }
  best_future_reward(state) {
    // impliment range like for python
    function* range(start, stop, step = 1) {
      if (stop == null) {
        // one param defined
        stop = start;
        start = 0;
      }

      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
      }
    }
    const act = new Set();
    for (let i of range(state.length)) {
      for (j in range(1, state[i] + 1)) {
        let tuple = [i, j];
        act.add(tuple);
      }
    }
    if (act.length == 0) return 0;
    let c = [];
    for (let i in act) {
      c1 = this.get_q_value(state, i);
      c.push(c1);
    }
    return c.length;
  }
  choose_action(state, epsilon = true) {
    // emlemented - range()
    function* range(start, stop, step = 1) {
      if (stop == null) {
        // one param defined
        stop = start;
        start = 0;
      }

      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
      }
    }

    let d = new Set();
    for (let i = 0; i < state.length; i++) {
      const element = state[i];
      for (let j of range(1, element + 1)) {
        let tuple = [i, j];
        d.add(tuple);
      }
    }

    let a = state;

    if (epsilon === false) {
      let best = new Object();
      let p = -1000000000;
      for (let i in d) {
        b = [a, i];
        if (b.includes(Object.keys(this.q))) {
          if (p < this.q[b]) {
            p = this.q[b];
            best = i;
          }
        } else {
          if (p < 0) {
            p = 0;
            best = i;
          }
        }
      }
    } else if (epsilon === true) {
      const r = Math.random();
      if (r > this.epsilon) {
        const feedback = this.choose_action(state, true);
        // console.log(feedback);
        return feedback; //this.choose_action(state, true)
      } else {
        d = Array.from(d);
        let rand = d[(Math.random() * d.length) | 0];
        return rand;
      }
    }
  }
}

// start the game
// const start = play();

function train(n) {
  const player = new NimAI();
  for (let i = 0; i < n; i++) {
    // console.log(`Playing training game ${i + 1}"`);
    const game = new Nim();
    // Keep track of last move made by either player
    const last = {
      0: { state: null, action: null },
      1: { state: null, action: null },
    };

    // game loop
    while (true) {
      // keep track of current state and action
      const state = game.piles;
      const action = player.choose_action(game.piles);

      //  Keep track of last state and action
      last[game.player]["state"] = state;
      last[game.player]["action"] = action;

      let pileHand = action[0];
      let countHand = action[1];

      // // make move
      game.move(pileHand, countHand);
      const new_state = game.piles;

      //  When game is over, update Q values with rewards
      if (game.winner !== null) {
        player.update(state, action, new_state, -1);
        player.update(
          last[game.player]["state"],
          last[game.player]["action"],
          new_state,
          1
        );
        break;
        // If game is continuing, no rewards yet
      } else if (last[game.player]["state"] !== null) {
        player.update(
          last[game.player]["state"],
          last[game.player]["action"],
          new_state,
          0
        );
      }
    }
  }
  console.log("Done training");

  // Return the trained AI
  return player;
}


function play(ai,human_player = null) {
  const randomPlayer = () => {
    return Math.floor(Math.random() * 2);
  };
  if (human_player === null) {
    human_player = randomPlayer();
  }
  const game = new Nim();

  console.log(human_player);
  while (true) {
    console.log("piles:");
    for (let i = 0; i < game.piles.length; i++) {
      const pile = game.piles[i];
      console.log(`pile ${i}: ${pile}`);
    }
    const available_actions = game.available_actions(game.piles);
    // sleep

    const available = (action, available_actions) => {
      let answer = false;
      for (let each_action of available_actions) {
        const valid_action = each_action.toString() === action.toString();
        if (valid_action) answer = true;
      }
      return answer;
    };
    let pileHand = null;
    let countHand = null;
    if (game.player == human_player) {
      console.log("Your Turn");
      while (true) {
        const pile = parseInt(prompt(`(HUMAN) - Choose Pile\n${game.piles}`));
        const count = parseInt(prompt(`(HUMAN) - Choose Count\n${game.piles}`));
        pileHand = pile;
        countHand = count;
        if (available([pile, count], available_actions)) break;
        console.log("Invalid move try again");
      }
      // have Ai make a move
    } else {
        console.log("AI's Turn");
        let action = ai.choose_action(game.piles);

        pileHand = action[0];
        countHand = action[1];
        alert(`AI chose to take ${countHand} from ${pileHand}.`);
        //   while (true) {
        //     const pile = parseInt(prompt(`(AI) - Choose Pile\n${game.piles}`));
        //     const count = parseInt(prompt(`(AI - Choose Count\n${game.piles}`));
        //     pileHand = pile;
        //     countHand = count;
        //     if (available([pile, count], available_actions)) break;
        //     console.log("Invalid move try again");
        //   }
    }
    // make move
    game.move(pileHand, countHand);
    if (game.winner !== null) {
      console.log("GAME OVER");
      const winner = game.winner == human_player ? "Human" : "AI";
      console.log(`Winner is ${winner}`);
      alert(`Winner is ${winner}`);
      return;
    }
  }
}
const ai = train(100);
const start = play(ai)
