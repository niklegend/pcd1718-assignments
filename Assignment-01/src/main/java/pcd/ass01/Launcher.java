package pcd.ass01;

import javafx.application.Application;
import javafx.stage.Stage;

import java.io.IOException;

import static pcd.ass01.view.factories.FxWindowFactory.*;

public final class Launcher extends Application{

    public static void main(final String... args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) throws IOException {
        defaultInstance().openStartWindow();
    }
}
