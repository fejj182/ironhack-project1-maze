describe("Test Maze Generator", function () {

  it("Creates the maze", function() {

    expect(createMaze().totalCells).toEqual(400);

  });

	it("Checks player location", function() {

    expect(createPlayer().location).toEqual([19,19]);

  });

});
