(function () {
  $(function () {
    // calendar element 취득
    let calendarEl = $('#calendar')[0];
    // full-calendar 생성하기
    let calendar = new FullCalendar.Calendar(calendarEl, {
      height: '700px', // calendar 높이 설정
      expandRows: true, // 화면에 맞게 높이 재설정
      slotMinTime: '08:00', // Day 캘린더에서 시작 시간
      slotMaxTime: '20:00', // Day 캘린더에서 종료 시간
      // 해더에 표시할 툴바
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
      /** initialDate: '2021-07-15', // 초기 날짜 설정 (설정하지 않으면 오늘 날짜가 보인다.)**/
      navLinks: true, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
      editable: false, // 수정 가능?
      selectable: true, // 달력 일자 드래그 설정가능
      nowIndicator: true, // 현재 시간 마크
      dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
      locale: 'ko', // 한국어 설정
      timeZone: 'local', // 시간설정 'local' 가능!
      eventAdd: function (obj) {
        // 이벤트가 추가되면 발생하는 이벤트
        const title = obj.event.title;
        const start = obj.event.startStr;
        const end = obj.event.endStr;

      },
      eventChange: function (obj) {
        // 이벤트가 수정되면 발생하는 이벤트
        console.log(obj);
      },
      eventRemove: function (obj) {
        // 이벤트가 삭제되면 발생하는 이벤트
        console.log(obj);
      },
      select: function (arg) {
        // prompt
        (async () => {
          const { value: title } = await Swal.fire({
            title: '무엇을 하시나요?',
            input: 'text',
            inputPlaceholder: 'ex) 일본 여행',
          });
          // prompt

          // 이후 처리되는 내용.
          // confirm
          Swal.fire({
            title: `${title}을 일정에 추가하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '승인',
            cancelButtonText: '취소',
            reverseButtons: false, // 버튼 순서 거꾸로
          }).then((result) => {
            if (result.isConfirmed) {
              if (title) {
                if (title) {
                  calendar.addEvent({
                    title: title,
                    start: arg.start,
                    end: arg.end,
                    allDay: arg.allDay,
                    color: 'purple',
                  });
                }
              }
              Swal.fire(`${title}을 일정에 추가하였습니다.`);
            }
          });
        })();
        // 캘린더에서 드래그로 이벤트를 생성할 수 있다.
        calendar.unselect();
      },
      // 이벤트
      events: [{
        title: 'title',
        start: '2023-01-05',
        end: '2023-01-01',
        color: 'red'},
        {
          title: 'title1',
          start: '2023-01-05',
          end: '2023-01-05',
          color: 'purple'}]
    });
    // 캘린더 랜더링
    calendar.render();
  });
})();

