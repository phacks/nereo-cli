import moment from "moment";

import { getFirstDayOfMonth, getLastDayOfMonth } from "../src/utils";

describe("getFirstDayOfMonth", () => {
  test("it should get the first day of the month of the given date", () => {
    const assertions = [
      { date: "2017-09-04", expected: "2017-09-01" },
      { date: "2017-01-01", expected: "2017-01-01" },
      { date: "2017-12-31", expected: "2017-12-01" },
    ];
    assertions.map(assertion =>
      expect(getFirstDayOfMonth(moment(assertion.date)).format()).toBe(
        moment(assertion.expected).format()
      )
    );
  });
});

describe("getLastDayOfMonth", () => {
  test("it should get the last day of the month of the given date", () => {
    const assertions = [
      { date: "2017-09-04", expected: "2017-09-30" },
      { date: "2017-01-01", expected: "2017-01-31" },
      { date: "2017-12-31", expected: "2017-12-31" },
    ];
    assertions.map(assertion =>
      expect(getLastDayOfMonth(moment(assertion.date)).format()).toBe(
        moment(assertion.expected).format()
      )
    );
  });
});
