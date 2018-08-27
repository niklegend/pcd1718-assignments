package pcd.ass04.services.room;

final class Channels {

    private static final String ROOM_CHANNEL = "room";

    static final String INDEX = ROOM_CHANNEL + ".index";
    static final String STORE = ROOM_CHANNEL + ".storeUser";
    static final String SHOW = ROOM_CHANNEL + ".show";
    static final String UPDATE = ROOM_CHANNEL + ".updateUser";
    static final String DESTROY = ROOM_CHANNEL + ".destroyUser";
    static final String JOIN = ROOM_CHANNEL + ".join";
    static final String LEAVE = ROOM_CHANNEL + ".leave";
    static final String MESSAGES = ROOM_CHANNEL + ".messages";
    static final String STATUSCS = ROOM_CHANNEL + ".status";
    static final String ENTERCS = ROOM_CHANNEL + ".enterCS";
    static final String EXITCS = ROOM_CHANNEL + ".exitCS";

}