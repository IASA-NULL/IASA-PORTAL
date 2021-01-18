import express from "express";

import { Permission } from "../../scheme/api/auth";
import createResponse from "../createResponse";
import { MyeonbulRequestListType } from "../../scheme/api/myeonbul";
import db from "../util/db";

const router = express.Router();

router.use((req, res, next) => {
  if (!req.auth) {
    res.status(401);
    res.send(createResponse(false, "먼저 로그인하세요."));
  } else {
    next();
  }
});

router.post("/request", async (req, res, next) => {
  if (req.auth.permission === Permission.student) {
    res.status(501);
    res.send(createResponse(false, "구현하지 않음 : 학생이 면불을 요청"));
  } else {
    res.status(403);
    res.send(createResponse(false, "권한이 없어요."));
  }
});

router.post("/accept", async (req, res, next) => {
  if (req.auth.permission === Permission.student) {
    res.status(501);
    res.send(createResponse(false, "구현하지 않음 : 교사가 면불을 수락"));
  } else {
    res.status(403);
    res.send(createResponse(false, "권한이 없어요."));
  }
});

router.post("/deny", async (req, res, next) => {
  if (req.auth.permission === Permission.student) {
    res.status(501);
    res.send(createResponse(false, "구현하지 않음 : 교사가 면불을 거절"));
  } else {
    res.status(403);
    res.send(createResponse(false, "권한이 없어요."));
  }
});

router.get("/", async (req, res, next) => {
  let myeonbulDB = await db.direct("myeonbul");
  if (!myeonbulDB) {
    res.status(500);
    res.send(createResponse(false, "DB 오류"));
  }

  if (req.auth.permission === Permission.admin) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 관리자가 면불을 조회"));
  } else if (req.auth.permission === Permission.teacher) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 교사가 면불을 조회"));
  } else if (req.auth.permission === Permission.student) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 학생이 면불을 조회"));
  } else {
    res.status(403);
    res.send(createResponse(false, "관리자, 교사 또는 학생만 조회 가능"));
  }
});

router.post("/", async (req, res, next) => {
  let myeonbulDB = await db.direct("myeonbul");
  if (!myeonbulDB) {
    res.status(500);
    res.send(createResponse(false, "DB 오류"));
  }

  if (req.auth.permission === Permission.admin) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 관리자가 면불을 생성"));
  } else if (req.auth.permission === Permission.teacher) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 교사가 면불을 생성"));
  } else {
    res.status(403);
    res.send(createResponse(false, "관리자 또는 교사만 생성 가능"));
  }
});

router.delete("/", async (req, res, next) => {
  let myeonbulDB = await db.direct("myeonbul");
  if (!myeonbulDB) {
    res.status(500);
    res.send(createResponse(false, "DB 오류"));
  }
  if (req.auth.permission === Permission.admin) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 관리자가 면불을 삭제"));
  } else if (req.auth.permission === Permission.teacher) {
    res.status(501);
    res.send(createResponse(false, "개발중 : 교사가 면불을 삭제"));
  } else {
    res.status(403);
    res.send(createResponse(false, "관리자 또는 교사만 삭제 가능"));
  }
});

router.post("/list", async (req, res, next) => {
  if (req.auth.permission === Permission.student) {
    if (req.body.type === MyeonbulRequestListType.listByDate) {
      res.status(403);
      res.send(createResponse(false, "권한이 없어요."));
    } else if (req.body.type === MyeonbulRequestListType.listByUser) {
      let myeonbulDB = await db.direct("myeonbul");
      if (!myeonbulDB) {
        res.status(500);
        res.send(createResponse(false, "DB 오류"));
      }
      res.send(
        createResponse([
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
              nickname: "면학 1차시",
            },
            teacher: {
              name: "가나다",
              id: 2,
            },
            place: "면학실",
            approved: false,
          },
          {
            timeRange: {
              begin: 1608467311778,
              end: 1608467411778,
            },
            teacher: {
              name: "이서현",
              id: 1,
            },
            place: "면학실",
            approved: true,
          },
        ])
      );
    } else {
      res.status(412);
      res.send(createResponse(false, "요청이 올바르지 않아요."));
    }
  }
});

export default router;
